<?php

namespace App\Http\Controllers;

use App\Services\ExternalCatalogService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class CatalogoController extends Controller
{
    protected ExternalCatalogService $catalogService;

    public function __construct(ExternalCatalogService $catalogService)
    {
        $this->catalogService = $catalogService;
    }

    #[OA\Get(
        path: "/api/catalogs/countries",
        summary: "Obtener listado de países desde SOAP",
        security: [["sanctum" => []]],
        tags: ["Catálogos"]
    )]
    #[OA\Response(response: 200, description: "Lista de países cargada con éxito")]
    public function getCountries(): JsonResponse
    {
        $data = $this->catalogService->getCountriesFromSoap();
        return response()->json($data, 200);
    }

    #[OA\Get(
        path: "/api/catalogs/location/{country_code}/{postal_code}",
        summary: "Obtener colonias desde API externa REST",
        security: [["sanctum" => []]],
        tags: ["Catálogos"]
    )]
    #[OA\Response(response: 200, description: "Lista de colonias cargada con éxito")]
    public function getNeighborhoods($country_code, $postal_code): JsonResponse
    {
        $data = $this->catalogService->getNeighborhoodsFromRest($country_code, $postal_code);
        return response()->json($data, 200);
    }
}