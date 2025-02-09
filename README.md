# Modulo

Proyecto final TCG Market: Creación de la API REST con Node.js / Express para proyecto final de Desafío LATAM.

## Descripción

Se crea un proyecto de Node.js con Express, el cual permite gestionar usuarios y autenticación mediante JWT, soportando registro, inicio de sesión y obtención de datos del usuario autenticado.

## Instalación

Para levantar el proyecto, se debe ejecutar los sgtes comandos:

```
npm install
npm run dev
```

## Endpoints

[Contratos](./API-Contracts.md)

## Configuración de entorno

Para ejecutar el proyecto correctamente, asegúrate de crear un archivo `.env` en la raíz del proyecto con el siguiente formato:

```ini
DB_USER=db_user
DB_HOST=localhost
DB_NAME=tcg_market
DB_PASSWORD=password
DB_PORT=5432
JWT_SECRET=secret_key
```

## Tests

Para ejecutar los tests, ejecuta los siguientes comandos:

```bash
npm test
```