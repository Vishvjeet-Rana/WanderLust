import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { validateReview, isLoggedIn, isReviewAutor } from "../middleware.js";
import { createReview, deleteReview } from "../controllers/review.js";

const router = express.Router({ mergeParams: true }); // ✅ Important fix

// adding a review
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAutor, wrapAsync(deleteReview));

export default router;
