var CG			= require("../models/cg")
	,Comment	= require("../models/comment");

//METHOD #1
var middlewareObj	= {};	//declaration

//check if user is logged in and is, its campground
middlewareObj.checkCampgroundOwnership = function(req, res, next) {	//definition
	//Is user logged in
	if(req.isAuthenticated()){
		CG.findById(req.params.id, (err, campground)=>{
			if(err) {
				req.flash("error", err.message);
				res.redirect("back");
			} else if(!campground) {
				req.flash("error", "campground could not be found!");
				res.redirect("back");
			} else {
				//If yes, does user own the campground
				if(campground.author.id.equals(req.user._id)) {
				//campground.author.id is a js obj	//req.user._id is a str
				//so they can't be compared using === or == in the if statement. Hence ^ code.
				//.equals is a mongoose func to compare a js obj to a str
					//If yes, give edit access to the campground
					return next();
				} else {
					//If no, redirect
					req.flash("error", "You don't have permission!");
					res.redirect("back");
				}
			}
		});
	} else {
		//If no, redirect
		req.flash("error", "You need to be logged in first!");
		res.redirect("back");	//back keyword will take the users to the previous page
	}
}

//check if user is logged in and is, its comment
middlewareObj.checkCommentOwnership = function(req, res, next) {	//definition
	//Is user logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, comment)=>{
		if(err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else if(!comment) {
			req.flash("error", "comment could not be found!");
			res.redirect("back");
		} else {
			//If yes, does user own the comment
			if(comment.author.id.equals(req.user._id)) {
			//comment.author.id is a js obj	//req.user._id is a str
			//so they can't be compared using === or == in the if statement. Hence ^ code.
			//.equals is a mongoose func to compare a js obj to a str
				//If yes, give edit access to the comment
				return next();
			} else {
				//If no, redirect
				//res.send("You cannot modify somebody else's comment");
				req.flash("error", "You don't have permission!");
				res.redirect("back");
			}
		}
		});
	} else {
		//If no, redirect
		//res.send("you are not logged in");
		req.flash("error", "You need to be logged in first!");
		res.redirect("back");	//back keyword will take the users to the previous page
	}
}
//check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to log in first!");
	res.redirect("/login");
}

module.exports = middlewareObj;		//exporting the object
 
// //METHOD #2
// var middlewareObj	= {						//definition & declaration in the same statement
// 	checkCampgroundOwnership: function(){/*function definition*/},
// 	checkCommentOwnership: function(){/*function definition*/}
// };

// module.exports = middlewareObj;		//exporting the object

// //METHOD #3
// module.exports = {
// 	checkCampgroundOwnership: function(){/*function definition*/},
// 	checkCommentOwnership: function(){/*function definition*/}
// };