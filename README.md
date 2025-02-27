# Modulo

Proyecto final TCG Market: Creación de la API REST con Node.js / Express para proyecto final de Desafío LATAM.

## Descripción

Se crea un proyecto de Node.js con Express, el cual permite gestionar usuarios y autenticación mediante JWT, soportando registro, inicio de sesión. Creación de cartas, comentarios y pedidos.

## Instalación

Para levantar el proyecto, se debe ejecutar los sgtes comandos:

```
npm install
npm run dev
```

## Creación de la base de datos

Para crear la base de datos ejecutar los comandos del archivo `init.sql` en la base de datos PostgreSQL que esta en la ruta

[Init.sql](./src/config/init.sql)


## Endpoints

[Contratos](./API-Contracts.md)

## Configuración variables de entorno

Para ejecutar el proyecto correctamente, asegúrate de crear un archivo `.env` en la raíz del proyecto con el siguiente formato:

[env.example](./.env.example)

## Tests

Para ejecutar los tests, ejecuta los siguientes comandos:

```bash
npm test
```

## Futuras funcionalidades

- Sistema de notificaciones
- Sistema de subastas
- Sistema de subida de imagenes
- Fecha al historial de ventas
- Sistema de reputación
- Sistema de favoritos
- Sistema de pagos
  - Sistema de pagos con Stripe
  - Sistema de pagos con Mercado Pago
  - Sistema de pagos con PayPal
