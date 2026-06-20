<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique(); //  SOL-2025-000001
            $table->string('title', 120);
            $table->text('description');
            $table->enum('category', ['Trámite', 'Servicio público', 'Soporte técnico', 'Atención ciudadana', 'Otro']);
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['received', 'in_review', 'resolved', 'rejected'])->default('received');
            $table->string('country_code'); // Siglas SOAP
            $table->string('postal_code');   // CP del usuario
            $table->string('neighborhood');  // Colonia REST
    
            $table->date('due_date')->nullable(); // Fecha de vencimiento opcional
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
