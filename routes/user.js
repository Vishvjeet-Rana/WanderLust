import express from "express";
const router = express.Router();
import User from "../model/user.js";
import ExpessError from "../utils/ExpressError.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import { loginUser, logoutUser, signupUser } from "../controllers/user.js";

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(signupUser));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(loginUser)
);

router.get("/logout", logoutUser);

export default router;
