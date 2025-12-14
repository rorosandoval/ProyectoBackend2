import { Router } from "express";
import passport from "passport";
import {
  authorization,
  authenticateJWT,
} from "../middlewares/auth.middleware.js";
import {
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

router.post(
  "/",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/users/failregister",
  }),
  registerUser
);

router.get("/failregister", (req, res) => {
  res.status(400).send({
    status: "error",
    message: "Error al registrar el usuario",
  });
});

router.get("/", authenticateJWT, authorization(["admin"]), getAllUsers);

router.put("/:uid", authenticateJWT, authorization(["admin"]), updateUser);

router.delete("/:uid", authenticateJWT, authorization(["admin"]), deleteUser);

export default router;
