<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RequestModel;
use App\Services\RequestService;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class RequestController extends Controller
{
    protected RequestService $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    #[OA\Get(
        path: "/requests",
        summary: "Listar solicitudes ciudadanas",
        description: "Retorna el listado de solicitudes filtrado automáticamente por Rol.",
        security: [["sanctum" => []]],
        tags: ["Solicitudes"]
    )]
    #[OA\Response(response: 200, description: "Operación exitosa")]
    #[OA\Response(response: 401, description: "No autenticado")]
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'revisor') {
            $requests = RequestModel::with('user')->orderBy('created_at', 'desc')->get();
        } else {
            $requests = RequestModel::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        }

        return response()->json($requests, 200);
    }

    #[OA\Post(
        path: "/requests",
        summary: "Registrar una nueva solicitud ciudadana",
        description: "Crea una solicitud en la base de datos vinculada al usuario autenticado. Genera el Folio único de forma automática.",
        security: [["sanctum" => []]],
        tags: ["Solicitudes"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["title", "description", "category", "priority", "country_code", "postal_code", "neighborhood"],
            properties: [
                new OA\Property(property: "title", type: "string", example: "Bache crítico en avenida principal"),
                new OA\Property(property: "description", type: "string", example: "Falla severa de pavimentación frente al número 450"),
                new OA\Property(property: "category", type: "string", example: "Servicio público"),
                new OA\Property(property: "priority", type: "string", enum: ["low", "medium", "high"], example: "high"),
                new OA\Property(property: "country_code", type: "string", example: "MX"),
                new OA\Property(property: "postal_code", type: "string", example: "58000"),
                new OA\Property(property: "neighborhood", type: "string", example: "Centro Histórico"),
                new OA\Property(property: "due_date", type: "string", format: "date", example: "2026-07-15")
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Solicitud registrada con éxito")]
    #[OA\Response(response: 403, description: "Acción no autorizada para tu rol")]
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'solicitante') {
            return response()->json(['message' => 'Acción no autorizada para tu rol'], 403);
        }

        if ($request->has('country') && !$request->has('country_code')) {
            $request->merge(['country_code' => $request->country]);
        }
        if ($request->has('cp') && !$request->has('postal_code')) {
            $request->merge(['postal_code' => $request->cp]);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:120',
            'description' => 'required|string',
            'category' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'country_code' => 'required|string',
            'postal_code' => 'required|string',
            'neighborhood' => 'required|string',
            'due_date' => 'nullable|date',
        ]);

        $solicitud = $this->requestService->crearSolicitud($validatedData, $user);

        return response()->json([
            'message' => 'Solicitud ciudadana registrada con éxito.',
            'data' => $solicitud
        ], 201);
    }

    #[OA\Put(
        path: "/requests/{id}",
        summary: "Actualizar el estatus de una solicitud",
        description: "Permite a los revisores cambiar el estatus de una solicitud ciudadana bajo los estados oficiales.",
        security: [["sanctum" => []]],
        tags: ["Solicitudes"]
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        description: "ID primario de la solicitud a modificar",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["status"],
            properties: [
                new OA\Property(property: "status", type: "string", enum: ["received", "in_review", "resolved", "rejected"], example: "resolved")
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Estatus actualizado con éxito")]
    #[OA\Response(response: 403, description: "Acción no autorizada para tu rol")]
    #[OA\Response(response: 404, description: "Solicitud no encontrada")]
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->role !== 'revisor') {
            return response()->json(['message' => 'Acción no autorizada para tu rol'], 403);
        }
        $request->validate([
            'status' => 'required|in:received,in_review,resolved,rejected',
        ]);

        $solicitud = RequestModel::findOrFail($id);
        $solicitud->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Estatus de la solicitud actualizado con éxito.',
            'data' => $solicitud
        ], 200);
    }
}