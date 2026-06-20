<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;

class Zippopotam
{
   public function getNeighborhood($countryCode, $postalCode)
    {
        try {
            $response = Http::get("http://api.zippopotam.us/{$countryCode}/{$postalCode}");//este es el endpoint de la api 
            if ($response->successful()) {
                $data = $response->json();
               
                return array_map(function ($place) {
                    return $place['place name']; // devuelve el nombre de las colonias 
                }, $data['places'] ?? []); // asegura que places exista en la respuesta
            }

            return [];
        } catch (\Exception $e) {
            return [];
        }
    }   
} 
