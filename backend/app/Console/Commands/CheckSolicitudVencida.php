<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\RequestModel;
use Carbon\Carbon;


class CheckSolicitudVencida extends Command
{
    /**
     * @var string
     */
    protected $signature = 'requests:check-overdue';

    /**
     * @var string
     */
    protected $description = 'Detecta las solicitudes ciudadanas vencidas que siguen abiertas y muestra un resumen.';

    public function handle()
    {
        $hoy = Carbon::now()->toDateString();
        // para buscar las solicitudes vencidas 
        $vencidas = RequestModel::where('due_date', '<', $hoy)
            ->whereNotIn('status', ['resolved', 'rejected'])
            ->get();
        $this->info("Solicitudes vencidas encontradas: " . $vencidas->count());
        if ($vencidas->isEmpty()) {
            $this->comment("¡Perfecto! No hay solicitudes atrasadas pendientes.");
            return 0;
        }
        foreach ($vencidas as $solicitud) {
            // Muestra el folio y el título de la solicitud
            $this->line("{$solicitud->folio} - {$solicitud->title}");
        }

        return Command::SUCCESS;
    }
}