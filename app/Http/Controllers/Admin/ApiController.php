<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Api;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ApiController extends Controller
{
    public function index()
    {
        $apis = Api::orderBy('name')->get()->map(fn (Api $a) => [
            'id' => $a->id,
            'name' => $a->name,
            'slug' => $a->slug,
            'method' => $a->method,
            'provider_cost' => (float) $a->provider_cost,
            'user_price' => (float) $a->user_price,
            'rate_limit_per_min' => $a->rate_limit_per_min,
            'is_enabled' => (bool) $a->is_enabled,
        ]);

        return Inertia::render('Admin/Apis/Index', ['apis' => $apis]);
    }

    public function create()
    {
        return Inertia::render('Admin/Apis/Form', ['api' => null]);
    }

    public function store(Request $request)
    {
        Api::create($this->payload($request));

        return redirect('/admin/apis')->with('success', 'API যোগ হয়েছে');
    }

    public function edit(Api $api)
    {
        return Inertia::render('Admin/Apis/Form', ['api' => [
            'id' => $api->id,
            'name' => $api->name,
            'slug' => $api->slug,
            'method' => $api->method,
            'url' => $api->url,
            'headers' => $api->headers ? json_encode($api->headers, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : '',
            'params' => $api->params ? json_encode($api->params, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : '',
            'response_path' => $api->response_path ?? '',
            'success_path' => $api->success_path ?? '',
            'success_value' => $api->success_value ?? '',
            'provider_cost' => (float) $api->provider_cost,
            'user_price' => (float) $api->user_price,
            'rate_limit_per_min' => $api->rate_limit_per_min,
            'is_enabled' => (bool) $api->is_enabled,
        ]]);
    }

    public function update(Request $request, Api $api)
    {
        $api->update($this->payload($request, $api));

        return redirect('/admin/apis')->with('success', 'API আপডেট হয়েছে');
    }

    public function destroy(Api $api)
    {
        $api->delete();

        return redirect('/admin/apis')->with('success', 'API মুছে ফেলা হয়েছে');
    }

    public function toggle(Api $api)
    {
        $api->update(['is_enabled' => ! $api->is_enabled]);

        return back();
    }

    private function payload(Request $request, ?Api $api = null): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => ['required', 'alpha_dash', 'max:255', Rule::unique('apis', 'slug')->ignore($api?->id)],
            'method' => 'required|in:GET,POST',
            'url' => 'required|url|max:2000',
            'headers' => 'nullable|string',
            'params' => 'nullable|string',
            'response_path' => 'nullable|string|max:255',
            'success_path' => 'nullable|string|max:255',
            'success_value' => 'nullable|string|max:255|required_with:success_path',
            'provider_cost' => 'required|numeric|min:0',
            'user_price' => 'required|numeric|min:0',
            'rate_limit_per_min' => 'nullable|integer|min:1',
        ]);

        $data['headers'] = $this->decodeJson($data['headers'] ?? null, 'headers');
        $data['params'] = $this->decodeJson($data['params'] ?? null, 'params');
        $data['response_path'] = $data['response_path'] ?: null;
        $data['success_path'] = $data['success_path'] ?: null;
        $data['success_value'] = $data['success_value'] ?: null;
        $data['rate_limit_per_min'] = $data['rate_limit_per_min'] ?: null;
        $data['is_enabled'] = $request->boolean('is_enabled');

        return $data;
    }

    private function decodeJson(?string $value, string $field): ?array
    {
        if (blank($value)) {
            return null;
        }

        $decoded = json_decode($value, true);

        if (! is_array($decoded)) {
            throw ValidationException::withMessages([$field => "{$field} JSON format ঠিক নেই"]);
        }

        return $decoded;
    }
}
