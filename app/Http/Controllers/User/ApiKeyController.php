<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ApiKeyController extends Controller
{
    // Key শুধু একবার দেখানো হয়, database-এ শুধু hash থাকে
    public function generate(Request $request)
    {
        $plain = 'sk_'.Str::random(40);

        $request->user()->update([
            'api_key_hash' => hash('sha256', $plain),
            'api_key_expires_at' => now()->addYear(),
        ]);

        return back()->with('new_api_key', $plain);
    }

    public function revoke(Request $request)
    {
        $request->user()->update([
            'api_key_hash' => null,
            'api_key_expires_at' => null,
        ]);

        return back();
    }
}
