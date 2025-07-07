const Listing=require("../models/listing.js");
// geocding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});


// another method of doing same thing
// const index = async (req, res, next) => {
//     let listings = await Listing.find({});
//     res.render("listings/index.ejs", { listings });
// };

// module.exports = { index };
module.exports.index= async (req, res, next) => {
        if(req.query.q){
            const searchQuery=req.query.q;
            const allListing=await Listing.find({
                location:{$regex:searchQuery,$options:"i"}

            });
            if(allListing.length==0){
                req.flash("error","No homie found");
                return res.redirect("/listings");

            }
            else{
               return res.render("listings/index.ejs",{listings:allListing});
            }
        }
        let listings = await Listing.find({});
        res.render("listings/index.ejs", { listings });
    }
    module.exports.renderNewForm = (req, res) => {
        res.render("listings/new.ejs");
    };
    module.exports.showListing=async(req,res)=>{
        let {id}=req.params;
        let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
        console.log(res.locals.currUser);
        console.log(listing.owner);
       if(!listing){
        req.flash("error","OOPS!Listing Not found");
        return res.redirect("/listings");
       }
        res.render("listings/views.ejs",{listing});
    };
module.exports.createListing=async(req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
       
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url);
    // console.log(filename);
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let saveListing=await newListing.save();
    console.log(saveListing);
    req.flash("success","Listing added!");
    res.redirect("/listings");
};
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);

    if(!listing){
        req.flash("error","OOPS!Listing Not found");
        return res.redirect("/listings");
       }
       let originalImageUrl=listing.image.url;
       originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_100");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};
module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    
  
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof(req.file)!="undefined"){
        let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    console.log("Updated");
    }
    req.flash("success","Listing Edited Successfully");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async(req,res)=>{    
    let {id}=req.params;
    let listing=await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};
module.exports.categories=async(req,res)=>{
    let {categories}=req.params;
    
    
    const regex = new RegExp(categories, 'i'); 
    const listings = await Listing.find({ categories: regex });
    res.render("listings/category.ejs",{listings,categories});
}