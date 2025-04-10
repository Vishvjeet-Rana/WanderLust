import Listing from "./model/listing.js";
import Review from "./model/review.js";
import { listingSchema, reviewSchema } from "./schema.js";
import ExpessError from "./utils/ExpressError.js";

export const isLoggedIn = (req, res, next) => {
  console.log(req.path, "....", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a new listing.");
    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

export const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "You are not owner of this listing. You can't do manipulations."
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

export const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpessError(404, errMsg);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpessError(404, errMsg);
  } else {
    next();
  }
};

export const isReviewAutor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "You are not author of this review. You can't do manipulations."
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};
