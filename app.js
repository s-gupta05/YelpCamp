var express					= require("express")
	,app					= express()
	,expressSession			= require("express-session")
	,bp						= require("body-parser")
	,mongoose				= require("mongoose")
	,flash					= require("connect-flash")
	,passport				= require("passport")
	,localStrategy			= require("passport-local")
	,passportLocalMongoose	= require("passport-local-mongoose")
	,methodOverride			= require("method-override")
	// routes declaration
	,CG						= require("./models/cg")
	,Comment				= require("./models/comment")
	,User					= require("./models/user")
	,campgroundRoutes		= require("./routes/campgrounds")
	,commentRoutes			= require("./routes/comments")
	,indexRoutes			= require("./routes/index");
//	,seedDB					= require("./seeds");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost/yelpcamp"); //yelpcamp here is the db name. If it does not exist, it will get created

app.use(bp.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); //"dirname" refers to the directory path in which the app.js script will run
app.use(methodOverride("_method"));
app.use(flash());

//----PASSPORT CONFIGURATION----//
app.use(expressSession({
	secret: "try new username",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser	= req.user;	//currentUser will be identified in ejs; while req.user is not identified
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next();
});

//Creating routes shorthand
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.set("view engine", "ejs")

// seedDB(); 

/////----Start the server----/////
var port = process.env.PORT || 3000;
app.listen(port, () => { 
	console.log("YelpCamp server started. Listening to port " + port);
});

