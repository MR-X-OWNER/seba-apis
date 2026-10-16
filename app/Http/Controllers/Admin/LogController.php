<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApiRequest;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index()
    {
        $logs = ApiRequest::with(['user:id,email', 'api:id,name'])
            ->latest()
            ->limit(100)
            ->get()
            ->map(fn (ApiRequest $l) => [
                'id' => $l->id,
                'time' => $l->created_at?->format('d M H:i:s'),
                'user' => $l->user?->email,
                'api' => $l->api?->name,
                'status' => $l->status,
                'charged' => (float) $l->charged,
                'provider_cost' => (float) $l->provider_cost,
                'response_ms' => $l->response_ms,
                'error' => $l->error,
            ]);

        return Inertia::render('Admin/Logs/Index', ['logs' => $logs]);
    }
}
