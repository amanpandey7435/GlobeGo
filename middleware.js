
const Listing=require("./models/listing");
const {listingschema}=require("./schema.js");
const ExpressError=require("./utils/expresserror.js");
const Review=require("./models/reviews.js");
const {reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("success","User must Login");
        return res.redirect("/login");
    }
    next();

}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permisson to make changes");
        return res.redirect(`/listings/${id}`);
    }

    next();
}
module.exports.validateListing=// creating a function
(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
   
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
   
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You didn't created this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}