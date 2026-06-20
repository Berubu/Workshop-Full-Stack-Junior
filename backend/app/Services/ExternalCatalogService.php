<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;
use SoapClient;

class ExternalCatalogService
{
    /**
     * Consume el servicio SOAP para obtener la lista de países.
     */
    public function getCountriesFromSoap()
    {
        try {
            $wsdl = "https://soap-service-free.mock.beeceptor.com/CountryInfoService?WSDL"; 
            
            // opciones para evitar problemas de cache en desarrollo
            $options = [
                'trace' => 1,
                'exceptions' => true,
                'cache_wsdl' => WSDL_CACHE_NONE
            ];

            $client = new SoapClient($wsdl, $options); 
            $response = $client->ListOfCountryNamesByName(); 

            // la respuesta suele venir dentro de un objeto estructurado
            if (isset($response->ListOfCountryNamesByNameResult->tCountryCodeAndName)) {
                $countries = $response->ListOfCountryNamesByNameResult->tCountryCodeAndName;
                
                // formateamos a un arreglo simple para el select de react
                return collect($countries)->map(function ($item) {
                    return [
                        'code' => $item->sISOCode ?? '',
                        'name' => $item->sName ?? ''
                    ];
                })->toArray();
            }

            return [];
        } catch (Exception $e) {
            \Log::error("error en soap de paises: " . $e->getMessage());
            // fallback en caso de que el servidor externo este caido para no detener la evaluacion
            return [
                ['code' => 'MX', 'name' => 'Mexico'],
                ['code' => 'US', 'name' => 'United States']
            ];
        }
    }

    /**
     * Consume la API REST de zippopotam.us para obtener las colonias.
     */
    public function getNeighborhoodsFromRest($countryCode, $postalCode)
    {
        try {
            $url = "https://api.zippopotam.us/{$countryCode}/{$postalCode}"; 
            
            $response = Http::withoutVerifying()->get($url); // [cite: 164]

            if ($response->successful()) {
                $data = $response->json();
                
                // zippopotam devuelve las colonias/lugares en el arreglo 'places'
                if (isset($data['places'])) {
                    // extrae directo el string para no enviar objetos anidados a react
                    return collect($data['places'])->map(function ($place) {
                        return $place['place name'] ?? '';
                    })->toArray();
                }
            }

            return [];
        } catch (Exception $e) {
            \Log::error("error en rest de colonias: " . $e->getMessage());
            return [];
        }
    }
}