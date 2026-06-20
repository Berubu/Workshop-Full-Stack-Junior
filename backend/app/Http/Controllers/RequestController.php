<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RequestModel;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    // 1. LISTAR SOLICITUDES (GET /api/requests)
    public function index()
    {
        $user = Auth::user();

        // Si es revisor, ve todas las solicitudes del sistema
        if ($user->role === 'revisor') {
            $requests = RequestModel::with('user')->orderBy('created_at', 'desc')->get();
        } else {
            // Si es solicitante, solo ve y lista las suyas propias
            $requests = RequestModel::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        }

        return response()->json($requests, 200);
    }

    // 2. CREAR SOLICITUD (POST /api/requests)
    public function store(Request $request)
    {
        $user = Auth::user();

        // Seguridad arquitectónica: Validamos que solo el solicitante pueda crear
        if ($user->role !== 'solicitante') {
            return response()->json(['message' => 'Acción no autorizada para tu rol'], 403);
        }

        // Validaciones estrictas según la tabla del requerimiento
        $request->validate([
            'title' => 'required|string|max:120',
            'description' => 'required|string',
            'category' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'country_code' => 'required|string',
            'postal_code' => 'required|string',
            'neighborhood' => 'required|string',
            'due_date' => 'nullable|date',
        ]);

        // Algoritmo para generar el folio autoincremental único: SOL-2026-000001
        $currentYear = date('Y');
        $latestRequest = RequestModel::where('folio', 'LIKE', "SOL-{$currentYear}-%")->latest()->first();
        
        if ($latestRequest) {
            // Extraemos el número final del folio anterior y le sumamos 1
            $parts = explode('-', $latestRequest->folio);
            $nextNumber = intval($parts[2]) + 1;
        } else {
            $nextNumber = 1;
        }
        
        $folio = "SOL-{$currentYear}-" . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

        // Creamos el registro inyectando de forma segura el user_id del Token de Sanctum
        $solicitud = RequestModel::create([
            'folio' => $folio,
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority,
            'status' => 'received', // Estado por defecto según rúbrica
            'country_code' => $request->country_code,
            'postal_code' => $request->postal_code,
            'neighborhood' => $request->neighborhood,
            'due_date' => $request->due_date,
            'user_id' => $user->id, // El ID extraído del Token seguro
        ]);

        return response()->json([
            'message' => 'Solicitud ciudadana registrada con éxito.',
            'data' => $solicitud
        ], 21);
    }
}