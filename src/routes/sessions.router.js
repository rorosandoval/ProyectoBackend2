import { Router } from "express";
import passport from "passport";
import {
  login,
  current,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/sessions.controller.js";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/faillogin",
  }),
  login
);

router.get("/faillogin", (req, res) => {
  res.status(401).send({
    status: "error",
    message: "Error en el login",
  });
});

router.get(
  "/current",
  passport.authenticate("current", {
    session: false,
  }),
  current
);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
