import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../model/listing.js";
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

// all listings - change to just "/"
router.get("/", wrapAsync(index));

// new form route - move this before /:id routes
router.get("/new", isLoggedIn, newFormRoute);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editRoute));

// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(updateRoute)
);

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteRoute));

// create new list
router.post("/", validateListing, wrapAsync(createNewList));

// show an individual list
router.get("/:id", wrapAsync(showList));

export default router;
