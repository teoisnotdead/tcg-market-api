import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import cardRoutes from "./routes/cards.routes.js" 
import commentRoutes from "./routes/comments.routes.js"
import orderRoutes from "./routes/orders.routes.js"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use("/", authRoutes)
app.use("/", cardRoutes)
app.use("/", commentRoutes)
app.use("/", orderRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Ocurrió un error en el servidor", error: err.message })
})

export default app