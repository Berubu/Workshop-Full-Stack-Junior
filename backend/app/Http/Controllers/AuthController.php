<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: "/login",
        summary: "Autenticación de usuarios",
        description: "Valida las credenciales del ciudadano o revisor y retorna un token Sanctum real.",
        tags: ["Autenticación"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["email", "password"],
            properties: [
                new OA\Property(property: "email", type: "string", format: "email", example: "solicitante@mail.com"),
                new OA\Property(property: "password", type: "string", format: "password", example: "123456")
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Autenticación exitosa",
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "token", type: "string", example: "1|kHz7b..."),
                new OA\Property(property: "user", type: "object", properties: [
                    new OA\Property(property: "name", type: "string", example: "Solicitante"),
                    new OA\Property(property: "email", type: "string", example: "solicitante@mail.com"),
                    new OA\Property(property: "role", type: "string", example: "solicitante")
                ])
            ]
        )
    )]
    #[OA\Response(response: 401, description: "Credenciales incorrectas")]
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = [
            'email' => trim($request->email),
            'password' => trim($request->password),
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ], 200);
    }
}