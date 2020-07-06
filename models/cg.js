var mongoose	= require("mongoose");
//var Comment		= require("./comment");

//Schema setup
var cgSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment" // Refer to the Comment model. Here "Comment" is a var that is requiring the comment model file.
		}
	]
});

// cgSchema.pre('remove', async function() {
// 	await Comment.remove({
// 		id: {
// 			$in: this.comments
// 		}
// 	});
// });

//Compile the schema into a model
var CG = mongoose.model("CG", cgSchema); //CG in the bracket is collection name. DB will: 1)convert to lower case; 2)pluralise it. So, CG will become cgs.

module.exports = CG;