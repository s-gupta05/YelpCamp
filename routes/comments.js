var express		= require("express")
	,router		= express.Router({mergeParams: true})
	,CG			= require("../models/cg")
	,Comment	= require("../models/comment")
	,middleware	= require("../middleware");

//NEW route - show form to create new Comment
router.get("/new", middleware.isLoggedIn, (req, res)=>{
	//Find Campground By Id
	CG.findById(req.params.id, (err, cgs) => {
		if(err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else if(!cgs) {
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else {
			res.render("comments/new", {cgs: cgs});
		}
	});
});

//CREATE route - Add new Comment
router.post("/", middleware.isLoggedIn, (req, res) => {
	//lookup campground
	CG.findById(req.params.id, (err,cgs) => {
		if(err){
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		} else if(!cgs) {
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else {
			//create new comment
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					req.flash("error", "Something went wrong!");
				} else {
					//Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//link the comment to the campground
					cgs.comments.push(comment);
					cgs.save();
					
					//redirect to the campground show page
					res.redirect("/campgrounds/" + cgs._id);
				}
			});
		}
	});
});

//EDIT route - show form to modify existing comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req,res)=>{
	Comment.findById(req.params.comment_id, (err,comment)=>{
		res.render("comments/edit", {campground_id: req.params.id, comment: comment});
	});
});

//UPDATE route - save modification to existing comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,comment)=>{
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY route - delete an existing campground and its comments
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err, result)=>{
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			req.flash("success", "comment deleted")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports	= router;