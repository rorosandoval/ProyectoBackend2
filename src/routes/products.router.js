import { Router } from "express";
import {
  authenticateJWT,
  authorization,
} from "../middlewares/auth.middleware.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/products.controller.js";

const router = Router();
const ADMIN_ROLE = ["admin"];

router.get("/", getProducts);

router.post("/", authenticateJWT, authorization(ADMIN_ROLE), createProduct);

router.put("/:pid", authenticateJWT, authorization(ADMIN_ROLE), updateProduct);

router.delete(
  "/:pid",
  authenticateJWT,
  authorization(ADMIN_ROLE),
  deleteProduct
);

export default router;
