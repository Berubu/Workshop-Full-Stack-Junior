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
        Schema::create('solicitud_ciudadanos', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique();
            $table->string('title',120);
            $table->text('description');
            $table->enum('category', ['general', 'especializada']);
            $table->enum('priority', ['low', 'medium', 'high']);
            $table->enum('status', ['received', 'in_process', 'resolved', 'rejected']);
            $table->string('country_code', 2);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('postal_code', 10);
            $table->string('neighborhood', 100);
            $table->date('due_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitud_ciudadanos');
    }
};
