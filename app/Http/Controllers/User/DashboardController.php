<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Api;
use App\Models\ApiRequest;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->startOfDay();

        $apis = Api::where('is_enabled', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'user_price']);

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'balance' => (float) $user->balance,
                'hits_today' => ApiRequest::where('user_id', $user->id)->where('created_at', '>=', $today)->count(),
                'hits_total' => ApiRequest::where('user_id', $user->id)->count(),
                'spending_total' => (float) Transaction::where('user_id', $user->id)->where('type', 'debit')->sum('amount'),
            ],
            'apis' => $apis,
        ]);
    }
}
