const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");

// requiring controllers
const userController=require("../controllers/users.js");
// signup
router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.singup));




// login

router.route("/login")
.get(userController.loginForm)
.post( saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.login
);

// logout
router.get("/logout",userController.logout);

module.exports=router;
