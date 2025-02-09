import request from "supertest"
import app from "../src/app.js"

describe("TCG Marketplace API", () => {
  let token = ""
  let createdCardId = ""
  let createdOrderId = ""

  // Generar un email aleatorio para cada prueba
  const randomEmail = `testuser_${Date.now()}@example.com`

  it("Debe registrar un usuario", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Test User",
      email: randomEmail,
      password: "password123",
    })

    console.log("Respuesta de registro:", res.body)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("token")
    token = res.body.token
  })

  it("Debe permitir el inicio de sesión", async () => {
    const res = await request(app).post("/auth/login").send({
      email: randomEmail,
      password: "password123",
    })

    console.log("Respuesta de login:", res.body)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("token")
    token = res.body.token
  })

  it("Debe permitir a un usuario crear una carta", async () => {
    const res = await request(app)
      .post("/cards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pikachu VMAX",
        description: "Carta legendaria",
        price: 20.5,
        image_url: "https://example.com/image.jpg",
      })

    console.log("Respuesta de creación de carta:", res.body)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("id")
    createdCardId = res.body.id
  })

  it("Debe obtener todas las cartas", async () => {
    const res = await request(app).get("/cards")
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("Debe permitir comentar en una carta", async () => {
    const res = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        card_id: createdCardId,
        content: "Esta carta es increíble!",
      })

    console.log("Respuesta de comentario:", res.body)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("id")
  })

  it("Debe obtener los comentarios de una carta", async () => {
    const res = await request(app).get(`/comments/${createdCardId}`)

    console.log("Comentarios de la carta:", res.body)

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("Debe permitir la creación de una orden", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [
          {
            card_id: createdCardId,
            quantity: 2,
          },
        ],
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("order")
    createdOrderId = res.body.order.id
  })

  it("Debe obtener las órdenes del usuario autenticado", async () => {
    const res = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${token}`)

    console.log("Órdenes del usuario:", res.body)

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
