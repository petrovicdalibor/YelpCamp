var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
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
         ref: "Comment"
      }
   ],
   bFrom: String,
   bTo: String,
   contact: String,
   price: String,
   location: String,
   createdAt: {
      type: Date, default: Date.now
   }
});

module.exports = mongoose.model("Campground", campgroundSchema);