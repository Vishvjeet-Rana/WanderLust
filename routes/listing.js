import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../model/listing.js";
import { listingSchema } from "../schema.js";
import ExpessError from "../utils/ExpressError.js";
const router = express.Router({ mergeParams: true }); // ✅ Important fix

function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpessError(404, errMsg);
  } else {
    next();
  }
}

// all listings - change to just "/"
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// new form route - move this before /:id routes
router.get("/new", (req, res) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to create a new listing.");
    return res.redirect("/login");
  }
  res.render("listings/createlist.ejs");
});

// edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for doesn't exists !");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`); // Fix template string syntax
  })
);

// delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

// create new list
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// show an individual list
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you requested for doesn't exists !");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

export default router;
