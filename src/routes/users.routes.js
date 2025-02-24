import { Router } from "express"
import { getProfile, updateProfile, getProfileStats } from "../controllers/users.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/me", verifyToken, getProfile)
router.put("/me", verifyToken, updateProfile)
router.get("/stats", verifyToken, getProfileStats)


export default router
