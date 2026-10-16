<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\BillingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(private BillingService $billing) {}

    public function index()
    {
        $users = User::where('role', 'user')
            ->orderByDesc('id')
            ->limit(200)
            ->get(['id', 'name', 'email', 'balance', 'status'])
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'balance' => (float) $u->balance,
                'status' => $u->status,
            ]);

        return Inertia::render('Admin/Users/Index', ['users' => $users]);
    }

    public function adjust(Request $request, User $user)
    {
        abort_unless($user->role === 'user', 404);

        $data = $request->validate([
            'type' => 'required|in:credit,debit',
            'amount' => 'required|numeric|min:0.01|max:1000000',
            'note' => 'nullable|string|max:255',
        ]);

        try {
            $this->billing->adjust($user, $data['type'], (float) $data['amount'], $data['note'] ?? null);
        } catch (InsufficientBalanceException) {
            return back()->withErrors(['amount' => 'Balance যথেষ্ট নেই']);
        }

        return back();
    }

    public function toggle(User $user)
    {
        abort_unless($user->role === 'user', 404);

        $user->update(['status' => $user->status === 'active' ? 'blocked' : 'active']);

        return back();
    }
}
