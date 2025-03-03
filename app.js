
if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
app.use(methodOverride('_method'));
app.set("view engine","ejs");
const port=8080;

// Utils WrapAsync & ExpressError
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/expresserror.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



// requiring ejs mate
engine = require('ejs-mate');
app.engine('ejs', engine);
const mongoose=require("mongoose");
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
const dbUrl = process.env.ATLASDB_URL ;
main().then(res=>console.log("Connection Successfull")).catch(err => console.log(err));
//|| "mongodb://localhost:27017/wanderlust"
async function main() {
    
    await mongoose.connect(dbUrl);
}
  app.listen(port,()=>{
    console.log("Port is listening at 8080");
})
const mongoClientPromise = new Promise((resolve) => {
    mongoose.connection.on("connected", () => {
        const client = mongoose.connection.getClient();
        resolve(client);
    });
});
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on("error", (err) => {
    console.log("Error in Mongo Store:", err);
});
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success  =req.flash("success");
    res.locals.error  =req.flash("error");
    res.locals.currUser=req.user;
    next();
});



// Joi object requiring
const {listingschema}=require("./schema.js");



// app.get("/",(req,res)=>{
//     res.send("Some message");
// })
// requiring router lisings
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// error handler
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})
app.use((err,req,res,next)=>{   
   let{statusCode=500,message="SomeThing Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    
})
