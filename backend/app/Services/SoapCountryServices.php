<?php

namespace App\Services;
class SoapCountryServices
{
   protected $wsdl;

    public function __construct()
    {
        $this->wsdl = "https://soap-service-free.mock.beeceptor.com/CountryInfoService?WSDL";

    }
    public function getCountries()
    {
        try {
            $client = new \SoapClient($this->wsdl, [
                'trace' => true,
                'exceptions' => true,
            ]);
            $response = $client->ListOfCountryNamesByName(); //para llamar al metodp que devuelve los paises en orden
            return $response->ListOfCountryNamesByNameResult->tCountryCodeAndName ?? []; 
        } catch (\Exception $e) {
            return []; // Manejar errores de SOAP
        }
    }
}