<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "API de Gestión de Solicitudes Ciudadanas",
    version: "1.0.0",
    description: "Documentación de los endpoints del Workshop Técnico de Gobierno Digital",
    contact: new OA\Contact(email: "soporte@gobierno.gob.mx")
)]
#[OA\Server(
    url: "http://localhost:8000/api",
    description: "Servidor de Desarrollo Local"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Ingrese el token Bearer generado en el login para acceder a las rutas protegidas"
)]
class SwaggerController extends Controller
{
}