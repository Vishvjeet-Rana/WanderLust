import express from "express";
const router = express.Router();
import User from "../model/user.js";
import ExpessError from "../utils/ExpressError.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import { loginUser, logoutUser, signupUser } from "../controllers/user.js";

router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsync(signupUser));

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login.ejs");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(loginUser)
  );

router.get("/logout", logoutUser);

export default router;
