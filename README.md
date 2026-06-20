# Sistema de Gestión de Solicitudes Ciudadanas y Ubicación Global

Este sistema consta de una arquitectura desacoplada compuesta por un Backend desarrollado en Laravel 11 que funciona exclusivamente como una API RESTful, y un Frontend desarrollado en React que actúa como aplicación cliente interactuando mediante peticiones HTTP (Axios)

## Requisitos
PHP >= 8.1 
Composer 
Node.js (versión LTS)
PostgreSQL
Extensión SoapClient de PHP habilitada
Perfil Solicitante
Email:solicitante@mail.com
Contraseña:123456
Perfil Revisor
Email:revisor@mail.com
Contraseña:123456
---

## Instalación del Back

1. Navegar a la carpeta del backend:
   cd backend

2. Instalar dependencias de PHP y composer:
    composer install

3. Crear el archivo de entorno
    cp .env.example .env\
    Configurar las variables de entorno 
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombre_de_tu_base
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

4. Generar las claves 
    php artisan key:generate

5. Ejecutar las migraciones y cargar los seeders obligatorios
    php artisan migrate:refresh --seed
6. Swagger
    php artisan l5-swagger:generate
7. Iniciar el servidor local
    php artisan serve

## Instalación del Front
    cd frontend

1. Instalar dependencias de Node
    npm install

2. Iniciar el entorno de desarrollo
    npm run dev

## Comando para tarea programada 
    php artisan requests:check-overdue