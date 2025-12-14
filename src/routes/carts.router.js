import { Router } from "express";
import {
  authenticateJWT,
  authorization,
} from "../middlewares/auth.middleware.js";
import {
  createCart,
  getCartById,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart,
  purchaseCart,
} from "../controllers/carts.controller.js";

const router = Router();

router.post("/", createCart);

router.get("/:cid", getCartById);

router.post(
  "/:cid/product/:pid",
  authenticateJWT,
  authorization(["user"]),
  addProductToCart
);

router.put(
  "/:cid/product/:pid",
  authenticateJWT,
  authorization(["user"]),
  updateProductQuantity
);

router.delete(
  "/:cid/product/:pid",
  authenticateJWT,
  authorization(["user"]),
  removeProductFromCart
);

router.delete("/:cid", authenticateJWT, authorization(["user"]), clearCart);

router.post(
  "/:cid/purchase",
  authenticateJWT,
  authorization(["user"]),
  purchaseCart
);

export default router;
