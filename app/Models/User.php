<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role', 'balance', 'status'];

    protected $hidden = ['password', 'remember_token', 'api_key_hash'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'balance' => 'decimal:4',
            'email_verified_at' => 'datetime',
            'api_key_expires_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
