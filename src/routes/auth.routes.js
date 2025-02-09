import { Router } from "express"
import { registerUser, loginUser, getUser } from "../controllers/users.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/auth/register", registerUser)
router.post("/auth/login", loginUser)
router.get("/auth/users", verifyToken, getUser)

export default router
