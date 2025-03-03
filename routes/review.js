const express=require("express");
const router=express.Router({mergeParams:true});
// requiring models
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expresserror.js");

const {reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");

const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

// requiring controllers
const reviewController=require("../controllers/reviews.js");


// functions midddleware

//  Reviews
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));
// delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;
