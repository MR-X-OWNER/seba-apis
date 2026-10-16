<?php

namespace App\Services;

use App\Exceptions\InsufficientBalanceException;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BillingService
{
    // API call-এর আগে টাকা কাটে। একই idempotency key দুবার এলে UNIQUE constraint
    // duplicate ধরে, তখন পুরো transaction rollback হয় (টাকা দুবার কাটে না)।
    public function charge(User $user, int $apiId, float $amount, string $key): Transaction
    {
        return DB::transaction(function () use ($user, $apiId, $amount, $key) {
            $locked = User::whereKey($user->id)->lockForUpdate()->firstOrFail();

            if ((float) $locked->balance < $amount) {
                throw new InsufficientBalanceException();
            }

            $after = round((float) $locked->balance - $amount, 4);
            $locked->update(['balance' => $after]);

            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'debit',
                'amount' => $amount,
                'balance_after' => $after,
                'api_id' => $apiId,
                'idempotency_key' => $key,
                'note' => 'API call',
            ]);
        });
    }

    public function refund(User $user, int $apiId, float $amount, string $key): void
    {
        DB::transaction(function () use ($user, $apiId, $amount, $key) {
            $locked = User::whereKey($user->id)->lockForUpdate()->firstOrFail();

            $after = round((float) $locked->balance + $amount, 4);
            $locked->update(['balance' => $after]);

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'refund',
                'amount' => $amount,
                'balance_after' => $after,
                'api_id' => $apiId,
                'idempotency_key' => 'refund:'.$key,
                'note' => 'Failed API refund',
            ]);
        });
    }

    // Admin-এর manual credit/debit
    public function adjust(User $user, string $type, float $amount, ?string $note): void
    {
        DB::transaction(function () use ($user, $type, $amount, $note) {
            $locked = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $current = (float) $locked->balance;

            if ($type === 'debit' && $current < $amount) {
                throw new InsufficientBalanceException();
            }

            $after = round($type === 'credit' ? $current + $amount : $current - $amount, 4);
            $locked->update(['balance' => $after]);

            Transaction::create([
                'user_id' => $user->id,
                'type' => $type,
                'amount' => $amount,
                'balance_after' => $after,
                'api_id' => null,
                'idempotency_key' => null,
                'note' => $note,
            ]);
        });
    }
}
