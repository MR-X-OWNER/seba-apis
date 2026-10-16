<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Api;
use App\Models\ApiRequest;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->startOfDay();

        $todayHits = fn () => ApiRequest::where('created_at', '>=', $today);
        $todaySuccess = fn () => $todayHits()->where('status', 'success');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::where('role', 'user')->count(),
                'active_users' => User::where('role', 'user')->where('status', 'active')->count(),
                'total_apis' => Api::count(),
                'hits_today' => $todayHits()->count(),
                'success_today' => $todayHits()->where('status', 'success')->count(),
                'failed_today' => $todayHits()->where('status', 'failed')->count(),
                'revenue_today' => (float) $todaySuccess()->sum('charged'),
                'profit_today' => (float) ($todaySuccess()->sum('charged') - $todaySuccess()->sum('provider_cost')),
            ],
        ]);
    }
}
