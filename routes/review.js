import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpessError from "../utils/ExpressError.js";
import Listing from "../model/listing.js";
import { reviewSchema } from "../schema.js";
import Review from "../model/review.js";

const router = express.Router({ mergeParams: true }); // ✅ Important fix

function validateReview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpessError(404, errMsg);
  } else {
    next();
  }
}

// adding a review
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Added");

    res.redirect(`/listings/${listing._id}`);
  })
);

// delete review route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
  })
);

export default router;
