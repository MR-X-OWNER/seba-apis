<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class AuthenticateApiKey
{
    public function handle(Request $request, Closure $next)
    {
        $key = $request->header('X-API-Key') ?? $request->bearerToken();

        if (! $key) {
            return response()->json(['success' => false, 'error' => 'API key missing'], 401);
        }

        $user = User::where('api_key_hash', hash('sha256', $key))->first();

        if (! $user) {
            return response()->json(['success' => false, 'error' => 'Invalid API key'], 401);
        }

        if ($user->status !== 'active') {
            return response()->json(['success' => false, 'error' => 'Account blocked'], 403);
        }

        if ($user->api_key_expires_at && $user->api_key_expires_at->isPast()) {
            return response()->json(['success' => false, 'error' => 'API key expired'], 401);
        }

        $request->attributes->set('api_user', $user);

        return $next($request);
    }
}
