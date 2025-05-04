import { Router } from "express";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite
} from "../controllers/favorites.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:sale_id", verifyToken, addFavorite);
router.delete("/:sale_id", verifyToken, removeFavorite);
router.get("/", verifyToken, getUserFavorites);
router.get("/check/:sale_id", verifyToken, checkFavorite);

export default router; 