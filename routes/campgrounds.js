var express		= require("express")
	,router		= express.Router()
	,CG			= require("../models/cg")
	,Comment	= require("../models/comment")
	,middleware	= require("../middleware");

//INDEX route - Show all Campgrounds
router.get("/", (req, res) => {
	CG.find({}, (err, cgs) => {
		if(err) {
			req.flash("error", err.message);
		} else {
			res.render("campgrounds/index", {cgs: cgs}); //"index is the ejs filename in the views directory"
		}
	});
});

//NEW route - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req,res) => {
	res.render("campgrounds/new"); //"new is the ejs filename in the views directory"
});

//CREATE route - Add new Campground
router.post("/", middleware.isLoggedIn, (req, res) => {
	//get data from the form
	var name	= req.body.name;
	var price	= req.body.price;
	var image	= req.body.image;
	var desc	= req.body.description;
	var author	= {
		id: req.user._id,
		username: req.user.username
	};
	var newCG = {name: name, price: price, image: image, description: desc, author: author};
	//add data to the list
	CG.create(newCG, (err, cgs) => {
		if(err) {
			req.flash("error", err.message);
		} else {
			//show page with added data - redirect to campgrounds
			req.flash("success", "Successfully created a new campground");
			res.redirect("/campgrounds");
		}
	});
});

//SHOW route - Show campground details
router.get("/:id", (req,res) => {
	//find cg with provided id
	CG.findById(req.params.id).populate("comments").exec(function(err, cgs){ //populate the 'comments' collection data
		if(err){
			req.flash("error", err.message);
			return res.redirect("/campgrounds");
		} else if(!cgs) {
			req.flash("error", "Campground not found!");
			return res.redirect("/campgrounds");
		} else {
			//render show template with that cg
			res.render("campgrounds/show", {cgs: cgs});
		}
	});
	
});

//EDIT route - show form to modify existing campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res)=>{
	CG.findById(req.params.id, (err, campground)=>{
		res.render("campgrounds/edit", {campground: campground});
		//1st var campground is used in the edit.ejs file; 2nd var campground is in this EDIT route callback func
	});
});

//UPDATE route - save modification to existing campground
router.put("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
	//find and update the campground
	CG.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
		if(err) {
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground updated successfully!")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect to show page
});

//DESTROY route - delete an existing campground and its comments
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
	CG.findById(req.params.id, (err,foundCampground)=>{
		if(err) {
			req.flash("error", err.message);
		} else {
			Comment.deleteMany({_id: {$in: foundCampground.comments}}, (err)=>{
				if(err) {
					req.flash("error", err.message);
				} else {
					CG.updateOne({_id: foundCampground.id}, {$pullAll: {comments: foundCampground.comments}}, (err)=>{
						if(err){
							req.flash("error", err.message);
						} else{
							CG.deleteOne({_id: foundCampground.id}, (err)=>{
								if(err){
									req.flash("error", err.message);
								} else {
									req.flash("success", "Campground deleted successfully!");
									res.redirect("/campgrounds");
								}
							});
						}
					});
				}
			});
		}
	});
});


// router.delete("/:id", (req,res)=>{
// 	//destroy campground
// 	CG.findByIdAndDelete(req.params.id, (err)=>{
// 		if(err) {
// 			res.redirect("/campgrounds/" + req.params.id);
// 		} else {
// 			//redirect
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });

//DESTROY route - delete an existing campground and its comments (using async and await)
// router.delete("/:id", async (req,res)=>{
// 	CG.findById(req.params.id, (err, foundCampground)=>{
// 		if(err) {
// 			res.redirect("/campgrounds/" + req.params.id);
// 		} else {
// 			//destroy campground
// 			foundCampground.remove();
// 			//redirect
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });

module.exports	= router;