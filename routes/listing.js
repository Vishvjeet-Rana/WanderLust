import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
// const parser = multer({ storage: storage });
const upload = multer({ storage: storage });
const router = express.Router({ mergeParams: true }); // Important fix

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

router.route("/").get(wrapAsync(index)).post(
  isLoggedIn,

  upload.single("listing[image]"),
  validateListing,
  wrapAsync(createNewList)
);

// .post(upload.single("listing[image]"), function (req, res) {
//   res.send(req.file);
// });

// new form route - move this before /:id routes
router.get("/new", isLoggedIn, newFormRoute);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editRoute));

// update, delete and show listing routes
router
  .route("/:id")
  .get(wrapAsync(showList))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateRoute)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(deleteRoute));

export default router;
