const User=require("../models/user.js");
module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs")
};
module.exports.singup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser= await User.register(newUser,password); // ✅ Correct
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User registered successfully");
        res.redirect("/listings");
        })
       
        
    }
    catch(e){
        req.flash("error","OOPs! you are not registered");
        res.redirect("/signup");
    }
};

module.exports.loginForm=(req,res)=>{
    
    res.render("users/login.ejs");
   
};
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome to User!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);  // ✅ Redirect user after login
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","User Logged out");
        res.redirect("/listings");
    })
};