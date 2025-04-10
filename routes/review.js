import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../model/listing.js";
import Review from "../model/review.js";
import { validateReview, isLoggedIn, isReviewAutor } from "../middleware.js";

const router = express.Router({ mergeParams: true }); // ✅ Important fix

// adding a review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
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
  isLoggedIn,
  isReviewAutor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
  })
);

export default router;
