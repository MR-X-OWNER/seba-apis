<?php

namespace App\Services;

use App\Models\Api;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class ProviderClient
{
    public function call(Api $api, array $input): Response
    {
        // Admin-এর fixed params user input-কে override করবে
        $params = array_merge($input, $api->params ?? []);

        $request = Http::timeout(15)->withHeaders($api->headers ?? []);

        return $api->method === 'POST'
            ? $request->post($api->url, $params)
            : $request->get($api->url, $params);
    }
}
