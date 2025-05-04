import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/users.routes.js"
import commentRoutes from "./routes/comments.routes.js"
import saleRoutes from "./routes/sales.routes.js"
import purchaseRoutes from "./routes/purchases.routes.js"
import favoriteRoutes from "./routes/favorites.routes.js"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/comments", commentRoutes)
app.use("/sales", saleRoutes)
app.use("/purchases", purchaseRoutes)
app.use("/favorites", favoriteRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Ocurrió un error en el servidor", error: err.message })
})

export default app