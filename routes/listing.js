import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";

const router = express.Router({ mergeParams: true }); // ✅ Important fix

// importing controllers
import {
  createNewList,
  deleteRoute,
  editRoute,
  index,
  newFormRoute,
  showList,
  updateRoute,
} from "../controllers/listing.js";

router
  .route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, validateListing, wrapAsync(createNewList));

// new form route - move this before /:id routes
router.get("/new", isLoggedIn, newFormRoute);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editRoute));

// update, delete and show listing routes
router
  .route("/:id")
  .delete(isLoggedIn, isOwner, wrapAsync(deleteRoute))
  .get(wrapAsync(showList))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(updateRoute));

export default router;
