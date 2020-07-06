var express		= require("express")
	,router		= express.Router()
	,passport	= require("passport")
	,User		= require("../models/user");

router.get("/", (req,res) => {
	res.render("landing");
});

//Register - Show
router.get("/register", (req,res)=>{
	res.render("register");
});

//Register - Create
router.post("/register", (req,res)=>{
	var newUser = new User({username: req.body.username});
	var newPassword = req.body.password;
	User.register(newUser, newPassword, (err,user)=>{
		if(err) {
			req.flash("error", err.message);
			return res.redirect("register");	//return will make the process move out of the callback function without moving into further code.
		}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success", "Welcome new member!");
			res.redirect("/campgrounds");
		});
	});
});

//Login - Show
router.get("/login", (req,res)=>{
	res.render("login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req,res)=>{}
);

//Logout - Show
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success", "You are logged out!")
	res.redirect("/");
});

module.exports	= router;