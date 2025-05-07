import express from "express"
import cors from "cors"
import swaggerUI from "swagger-ui-express"
import swaggerSpec from "./swagger.js"
import {
    authRoutes,
    userRoutes,
    commentRoutes,
    saleRoutes,
    purchaseRoutes,
    favoriteRoutes,
    categoryRoutes,
    languageRoutes
} from "./routes/index.js"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerSpec)
})

// Routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/comments", commentRoutes)
app.use("/sales", saleRoutes)
app.use("/purchases", purchaseRoutes)
app.use("/favorites", favoriteRoutes)
app.use("/categories", categoryRoutes)
app.use("/languages", languageRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Ocurrió un error en el servidor", error: err.message })
})

export default app