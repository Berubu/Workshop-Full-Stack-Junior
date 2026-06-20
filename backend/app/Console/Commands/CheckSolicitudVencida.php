<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\SolicitudCiudadano;

#[Signature('app:check-solicitud-vencida')]
#[Description('Command description')]
class CheckSolicitudVencida extends Command
{
    protected $signature='request:check-solicitud-vencida';
    protected $description='Verifica y muestra las solicitudes ciudadanas vencidas';

    public function handle(){
        $overdue=SolicitudCiudadano::where('due_date', '<', now())->whereNotIn('status', ['resolved', 'rejected'])->get();

        if($overdue->isEmpty()){
            $this->info('No hay solicitudes vencidas.');
            return 0;

    }
    $this->error("Se encontraron {$overdue->count()} solicitudes vencidas:");
    $this->table('Folio','Título','Usuario','Fecha de Vencimiento','Estatus', $overdue->map(fn($req)=>[$req->folio, $req->title, $req->status, $req->due_date])->toArray());
}
}
