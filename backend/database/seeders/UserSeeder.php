<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Usuario Solicitante
        User::create([
            'name' => 'Solicitante',
            'email' => 'solicitante@mail.com',
            'password' => Hash::make('123456'),
            'role' => 'solicitante',
        ]);

        // Usuario Revisor
        User::create([
            'name' => 'Revisor',
            'email' => 'revisor@mail.com',
            'password' => Hash::make('123456'),
            'role' => 'revisor',
        ]);
    }
}