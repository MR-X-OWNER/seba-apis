<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiRequest extends Model
{
    protected $table = 'api_requests';

    protected $fillable = [
        'user_id', 'api_id', 'status', 'charged', 'provider_cost', 'response_ms', 'error',
    ];
}
