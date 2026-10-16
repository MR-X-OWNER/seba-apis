<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Api;
use App\Models\ApiRequest;
use App\Models\ApiUserRule;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->startOfDay();

        $rules = ApiUserRule::where('user_id', $user->id)->get()->keyBy('api_id');

        // provider_cost ও লাভ কখনো user-কে পাঠানো হবে না
        $apis = Api::where('is_enabled', true)->orderBy('name')->get()
            ->filter(fn (Api $api) => ! $rules->get($api->id) || $rules->get($api->id)->is_enabled)
            ->map(fn (Api $api) => [
                'id' => $api->id,
                'name' => $api->name,
                'slug' => $api->slug,
                'price' => (float) ($rules->get($api->id)?->custom_price ?? $api->user_price),
                'endpoint' => url('/api/v1/call/'.$api->slug),
            ])
            ->values();

        $history = ApiRequest::with('api:id,name')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn (ApiRequest $r) => [
                'id' => $r->id,
                'time' => $r->created_at?->format('d M, H:i'),
                'api' => $r->api?->name,
                'status' => $r->status,
                'charged' => (float) $r->charged,
                'ms' => $r->response_ms,
            ]);

        $spent = (float) Transaction::where('user_id', $user->id)->where('type', 'debit')->sum('amount')
            - (float) Transaction::where('user_id', $user->id)->where('type', 'refund')->sum('amount');

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'balance' => (float) $user->balance,
                'hits_today' => ApiRequest::where('user_id', $user->id)->where('created_at', '>=', $today)->count(),
                'hits_total' => ApiRequest::where('user_id', $user->id)->count(),
                'spending_total' => $spent,
            ],
            'key' => [
                'has_key' => $user->api_key_hash !== null,
                'expires_at' => $user->api_key_expires_at?->format('d M Y'),
            ],
            'apis' => $apis,
            'history' => $history,
        ]);
    }
}
