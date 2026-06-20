<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SoapCountryServices;
use App\Services\Zippopotam;

class CatalogoController extends Controller
{
    protected $soapCountryService;
    protected $zippopotam;

    public function __construct(SoapCountryServices $soapService, Zippopotam $zippopotam)
    {
        $this->soapCountryService = $soapService;
        $this->zippopotam = $zippopotam;
    }
    public function getCountries(){
        $countries=$this->soapCountryService->getCountries();
        return response()->json($countries);
    } //endpoind de soap
    public function getNeighborhoods($countryCode, $postaleCode){
        $neightborhoods=$this->zippopotam->getNeighborhood($countryCode, $postaleCode);
        return response()->json($neightborhoods);
    }

}
