import { Router } from "express";
import { 
  createSale, 
  getAllSales, 
  getSaleById, 
  deleteSale,
  getMySales,
  getActiveSales,
  checkoutSale,
} from "../controllers/sales.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createSale);
router.get("/", getAllSales);
router.get("/active-sales", verifyToken, getActiveSales);
router.get("/all-sales", verifyToken, getMySales);
router.delete("/:id", verifyToken, deleteSale);
router.get("/:id", getSaleById);
router.post("/checkout", verifyToken, checkoutSale)

export default router;
