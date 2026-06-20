<?php

namespace App\Services;

use App\Models\RequestModel;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RequestService
{
    public function crearSolicitud(array $data, User $user): RequestModel
    {
        // asegura la consistencia del folio si entran múltiples peticiones al mismo tiempo
        return DB::transaction(function () use ($data, $user) {
            $currentYear = date('Y');
            $latestRequest = RequestModel::where('folio', 'LIKE', "SOL-{$currentYear}-%")
                ->lockForUpdate()
                ->latest()
                ->first();
            
            if ($latestRequest) {
                $parts = explode('-', $latestRequest->folio);
                $nextNumber = intval($parts[2]) + 1;
            } else {
                $nextNumber = 1;
            }
            
            $folio = "SOL-{$currentYear}-" . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

            return RequestModel::create([
                'folio' => $folio,
                'title' => $data['title'],
                'description' => $data['description'],
                'category' => $data['category'],
                'priority' => $data['priority'],
                'status' => 'received',
                'country_code' => $data['country_code'],
                'postal_code' => $data['postal_code'],
                'neighborhood' => $data['neighborhood'],
                'due_date' => $data['due_date'] ?? null,
                'user_id' => $user->id,
            ]);
        });
    }
}