/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (nunca se devuelve en las respuestas)
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440011
 *         name: Juan Pérez
 *         email: juan@ejemplo.com
 *         created_at: 2023-01-01T00:00:00.000Z
 *         updated_at: 2023-01-01T00:00:00.000Z
 *
 *     UserRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *       example:
 *         name: Juan Pérez
 *         email: juan@ejemplo.com
 *         password: Contraseña123!
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *       example:
 *         email: juan@ejemplo.com
 *         password: Contraseña123!
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT para autenticación
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           id: 550e8400-e29b-41d4-a716-446655440011
 *           name: Juan Pérez
 *           email: juan@ejemplo.com
 *           created_at: 2023-01-01T00:00:00.000Z
 *           updated_at: 2023-01-01T00:00:00.000Z
 *
 *     Comment:
 *       type: object
 *       required:
 *         - sale_id
 *         - user_id
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del comentario
 *         sale_id:
 *           type: string
 *           format: uuid
 *           description: ID de la venta a la que pertenece el comentario
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID del usuario que realizó el comentario
 *         user_name:
 *           type: string
 *           description: Nombre del usuario que realizó el comentario
 *         content:
 *           type: string
 *           description: Contenido del comentario
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440030
 *         sale_id: 550e8400-e29b-41d4-a716-446655440003
 *         user_id: 550e8400-e29b-41d4-a716-446655440011
 *         user_name: Juan Pérez
 *         content: ¡Excelente producto! ¿Aceptas cambios?
 *         created_at: 2023-07-25T12:34:56.789Z
 *
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único de la categoría
 *         name:
 *           type: string
 *           description: Nombre de la categoría
 *         slug:
 *           type: string
 *           description: Slug para URLs
 *         description:
 *           type: string
 *           description: Descripción de la categoría
 *         is_active:
 *           type: boolean
 *           description: Indica si la categoría está activa
 *         display_order:
 *           type: integer
 *           description: Orden de visualización
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440000
 *         name: Pokémon
 *         slug: pokemon
 *         description: Cartas del juego Pokémon Trading Card Game
 *         is_active: true
 *         display_order: 1
 *         created_at: 2023-01-01T00:00:00.000Z
 *         updated_at: 2023-01-01T00:00:00.000Z
 *
 *     Language:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del idioma
 *         name:
 *           type: string
 *           description: Nombre del idioma
 *         slug:
 *           type: string
 *           description: Slug para URLs
 *         is_active:
 *           type: boolean
 *           description: Indica si el idioma está activo
 *         display_order:
 *           type: integer
 *           description: Orden de visualización
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440001
 *         name: Inglés
 *         slug: ingles
 *         is_active: true
 *         display_order: 1
 *         created_at: 2023-01-01T00:00:00.000Z
 *         updated_at: 2023-01-01T00:00:00.000Z
 *
 *     Sale:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - quantity
 *         - category_id
 *         - language_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único de la venta
 *         seller_id:
 *           type: string
 *           format: uuid
 *           description: ID del vendedor
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         description:
 *           type: string
 *           description: Descripción del producto
 *         price:
 *           type: number
 *           format: float
 *           description: Precio del producto
 *         image_url:
 *           type: string
 *           description: URL de la imagen del producto
 *         quantity:
 *           type: integer
 *           description: Cantidad disponible
 *         status:
 *           type: string
 *           enum: [available, sold, cancelled]
 *           description: Estado de la venta
 *         views:
 *           type: integer
 *           description: Contador de visitas
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: ID de la categoría
 *         language_id:
 *           type: string
 *           format: uuid
 *           description: ID del idioma
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440003
 *         seller_id: 550e8400-e29b-41d4-a716-446655440004
 *         name: Charizard Holo 1st Edition
 *         description: Carta en excelente estado, PSA 9
 *         price: 1500.00
 *         image_url: https://ejemplo.com/imagen.jpg
 *         quantity: 1
 *         status: available
 *         views: 0
 *         category_id: 550e8400-e29b-41d4-a716-446655440000
 *         language_id: 550e8400-e29b-41d4-a716-446655440001
 *         created_at: 2023-07-25T12:34:56.789Z
 *
 *     Purchase:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único de la compra
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID del comprador
 *         sale_id:
 *           type: string
 *           format: uuid
 *           description: ID de la venta
 *         seller_id:
 *           type: string
 *           format: uuid
 *           description: ID del vendedor
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         description:
 *           type: string
 *           description: Descripción del producto
 *         price:
 *           type: number
 *           format: float
 *           description: Precio pagado
 *         image_url:
 *           type: string
 *           description: URL de la imagen del producto
 *         quantity:
 *           type: integer
 *           description: Cantidad comprada
 *         language_id:
 *           type: string
 *           format: uuid
 *           description: ID del idioma del producto
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: ID de la categoría del producto
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440010
 *         user_id: 550e8400-e29b-41d4-a716-446655440011
 *         sale_id: 550e8400-e29b-41d4-a716-446655440003
 *         seller_id: 550e8400-e29b-41d4-a716-446655440004
 *         name: Charizard Holo 1st Edition
 *         description: Carta en excelente estado, PSA 9
 *         price: 1500.00
 *         image_url: https://ejemplo.com/imagen.jpg
 *         quantity: 1
 *         language_id: 550e8400-e29b-41d4-a716-446655440001
 *         category_id: 550e8400-e29b-41d4-a716-446655440000
 *         created_at: 2023-07-25T12:34:56.789Z
 *
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del favorito
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID del usuario
 *         sale_id:
 *           type: string
 *           format: uuid
 *           description: ID de la venta marcada como favorita
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440020
 *         user_id: 550e8400-e29b-41d4-a716-446655440011
 *         sale_id: 550e8400-e29b-41d4-a716-446655440003
 *         created_at: 2023-07-25T12:34:56.789Z
 */ 