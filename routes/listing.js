const express=require("express");
const router=express.Router();
// requiring models
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expresserror.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
// requiring joi
const {listingschema}=require("../schema.js");
const {validateListing}=require("../middleware.js");
// requiring controller
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");

const upload = multer({ storage });


// all in one


// home route
// new listing route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

// new route

router.get("/new",isLoggedIn,listingController.renderNewForm);

// show delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))
.put(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.editListing));









// edit route
router.get("/:id/edit/",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));





module.exports=router;