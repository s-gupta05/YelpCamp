var mongoose = require("mongoose");

//Schema setup
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

//Compile the schema into a model
var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;