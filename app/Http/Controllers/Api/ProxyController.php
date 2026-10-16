<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Controllers\Controller;
use App\Models\Api;
use App\Models\ApiRequest;
use App\Models\ApiUserRule;
use App\Models\User;
use App\Services\BillingService;
use App\Services\ProviderClient;
use Illuminate\Database\QueryException;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;

class ProxyController extends Controller
{
    public function __construct(
        private BillingService $billing,
        private ProviderClient $provider,
    ) {}

    public function call(Request $request, string $slug): JsonResponse
    {
        /** @var User $user */
        $user = $request->attributes->get('api_user');

        if (DB::table('settings')->where('key', 'maintenance_mode')->value('value') === '1') {
            return $this->fail(503, 'Service is under maintenance');
        }

        $api = Api::where('slug', $slug)->where('is_enabled', true)->first();
        if (! $api) {
            return $this->fail(404, 'API not found');
        }

        $rule = $this->resolveRule($user, $api);
        if ($rule === null) {
            return $this->fail(403, 'API not allowed for this account');
        }

        if ($rule['per_minute'] && ! RateLimiter::attempt(
            "api:{$user->id}:{$api->id}", $rule['per_minute'], fn () => true, 60
        )) {
            return $this->fail(429, 'Rate limit exceeded');
        }

        if ($rule['daily_limit'] !== null) {
            $used = ApiRequest::where('user_id', $user->id)
                ->where('api_id', $api->id)
                ->where('created_at', '>=', now()->startOfDay())
                ->count();
            if ($used >= $rule['daily_limit']) {
                return $this->fail(429, 'Daily limit reached');
            }
        }

        $key = $request->header('Idempotency-Key')
            ?? hash('sha256', implode('|', [$user->id, $api->id, json_encode($request->all()), intdiv(time(), 60)]));

        try {
            $this->billing->charge($user, $api->id, $rule['price'], $key);
        } catch (InsufficientBalanceException) {
            return $this->fail(402, 'Insufficient balance');
        } catch (QueryException $e) {
            if (($e->errorInfo[1] ?? null) === 1062) {
                return $this->fail(409, 'Duplicate request');
            }
            throw $e;
        }

        $started = microtime(true);
        $response = null;
        $body = [];
        $error = null;

        try {
            $response = $this->provider->call($api, $request->all());
        } catch (\Throwable $e) {
            $error = 'Provider unreachable: '.$e->getMessage();
        }

        $ms = (int) ((microtime(true) - $started) * 1000);

        if ($response !== null) {
            $body = $response->json() ?? ['raw' => $response->body()];
            $error = $this->providerError($response, $body, $api);
        }

        if ($error !== null) {
            $this->billing->refund($user, $api->id, $rule['price'], $key);
            $this->log($user, $api, 'failed', 0, $ms, $error);

            return $this->fail(502, 'Provider failed, amount refunded');
        }

        $data = $api->response_path ? data_get($body, $api->response_path) : $body;

        $this->log($user, $api, 'success', $rule['price'], $ms, null);

        return response()->json(['success' => true, 'data' => $data]);
    }

    // Provider সফল কিনা যাচাই। ফিরলে কারণ (string), সফল হলে null।
    private function providerError(Response $response, array $body, Api $api): ?string
    {
        if (! $response->successful()) {
            return 'Provider HTTP '.$response->status();
        }

        if ($api->success_path) {
            $actual = $this->normalize(data_get($body, $api->success_path));
            if ($actual !== $this->normalize($api->success_value)) {
                return 'Provider reported failure ('.$api->success_path.'='.$actual.')';
            }
        }

        if ($api->response_path && data_get($body, $api->response_path) === null) {
            return 'Response path not found: '.$api->response_path;
        }

        return null;
    }

    // true/false ও 200/"200" একই রকম ভাবে তুলনা করার জন্য
    private function normalize(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        return trim((string) $value);
    }

    private function resolveRule(User $user, Api $api): ?array
    {
        $rule = ApiUserRule::where('user_id', $user->id)->where('api_id', $api->id)->first();

        if ($rule && ! $rule->is_enabled) {
            return null;
        }

        return [
            'price' => (float) ($rule?->custom_price ?? $api->user_price),
            'per_minute' => $rule?->rate_limit_per_min ?? $api->rate_limit_per_min,
            'daily_limit' => $rule?->daily_limit,
        ];
    }

    private function log(User $user, Api $api, string $status, float $charged, int $ms, ?string $error): void
    {
        ApiRequest::create([
            'user_id' => $user->id,
            'api_id' => $api->id,
            'status' => $status,
            'charged' => $charged,
            'provider_cost' => $status === 'success' ? $api->provider_cost : 0,
            'response_ms' => $ms,
            'error' => $error ? mb_substr($error, 0, 500) : null,
        ]);
    }

    private function fail(int $code, string $message): JsonResponse
    {
        return response()->json(['success' => false, 'error' => $message], $code);
    }
}
