<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SolicitudCiudadano;

class SolicitudCiudadanoController extends Controller
{
    public function __contruct()
    {
        $this->middleware('auth:api');
    }
    public function index()
    { //solicitudes
        $requests=auth()->user()->role=== 'revisor' ? SolicitudCiudadano::with('user')->get()
        :SolicitudCiudadano::where('user_id', auth()->id())->get();
        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $data=$request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'priority' => 'required|string',
            'country_code' => 'required|string|size:2',
            'postal_code' => 'required|string',
            'neighborhood' => 'required|string',
        ]);

        //los folios 
        $count=SolicitudCiudadano::whereYear('created_at', date('Y'))->count();
        $data['folio']='SOL-' . date('Y').'-'.str_pad($count, 5, '0', STR_PAD_LEFT);
        $data['user_id']=auth()->id();
    $data['status']='received';

        $solicitudCiudadano=SolicitudCiudadano::create($data);
        return response()->json(['mensaje' => 'Solicitud creada', 'data' => $solicitudCiudadano], 201);
    }
    public function show($id){ //para mostra detalles 
        return response()->json(SolicitudCiudadano::findOrFail($id));
    }
    public function updateStatus(Request $request, $id){
        if(auth()->user()->role !== 'revisor'){
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $request->validate([
            'status' => 'required|string|in:received,in_review,resolved,rejected',
            'due_date' => 'nullable|date',
        ]);
        $solicitudCiudadano=SolicitudCiudadano::findOrFail($id);
        $solicitudCiudadano->udate($request->only(['status','due_date']));
        return response()->json(['mensaje' => 'Solicitud actualizada', 'data' => $solicitudCiudadano]);
    }


}
