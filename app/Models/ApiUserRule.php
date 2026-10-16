<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiUserRule extends Model
{
    protected $table = 'api_user_rules';

    public $timestamps = false;

    protected $fillable = [
        'user_id', 'api_id', 'custom_price', 'is_enabled', 'rate_limit_per_min', 'daily_limit',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];
}
