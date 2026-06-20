<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'folio', 'title', 'description', 'category', 'priority', 
    'status', 'country_code', 'postal_code', 'neighborhood', 'due_date', 'user_id'
])]
class RequestModel extends Model
{
    // apunta la tabla requests
    protected $table = 'requests'; 

    protected $fillable = [
        'folio', 'title', 'description', 'category', 'priority', 
        'status', 'country_code', 'postal_code', 'neighborhood', 'due_date', 'user_id'
    ];

    // Relación: Una solicitud pertenece a un usuario creador
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}