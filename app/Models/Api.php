<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Api extends Model
{
    protected $table = 'apis';

    protected $fillable = [
        'name', 'slug', 'method', 'url', 'headers', 'params', 'response_path',
        'success_path', 'success_value',
        'provider_cost', 'user_price', 'success_charge', 'failed_charge',
        'is_enabled', 'rate_limit_per_min',
    ];

    protected $casts = [
        'headers' => 'array',
        'params' => 'array',
        'is_enabled' => 'boolean',
    ];
}
