import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  console.log(process.env.CLOUD_API_KEY, "app.js");
}

// console.log(process.env.SECRET);

import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import methodOverride from "method-override";
import engine from "ejs-mate";
import ExpessError from "./utils/ExpressError.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./model/user.js";
// import multer from "multer";
// const upload = multer({ dest: "uploads/" });

import listingsRouter from "./routes/listing.js";
import reviewsRouter from "./routes/review.js";
import userRouter from "./routes/user.js";

const app = express();

// __filename and __dirname setup:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.MY_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGODB SESSION", err);
});

const sessionOptions = {
  store,
  secret: process.env.MY_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // one week session
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// listing route
app.use("/listings", listingsRouter);

// review route
app.use("/listings/:id/reviews", reviewsRouter);

// user route
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpessError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  console.error("ERROR:", err); // Log the full error object to console
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log(`app listening at port 8080`);
});
