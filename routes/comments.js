let express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
  // find campground by id
  Campground.findById(req.params.id, function (err, campground) {
      if (err) {
          console.log(err);
      } else {
          res.render("comments/new", { campground: campground });
      }
  })
});

// comments create
router.post("/", middleware.isLoggedIn, function (req, res) {
  //lookup campground using ID
  Campground.findById(req.params.id, function (err, campground) {
      if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
      } else {
          Comment.create(req.body.comment, function (err, comment) {
              if (err) {
                  console.log(err);
              } else {
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success", "Successfully added comment");
                  res.redirect('/campgrounds/' + campground._id);
              }
          });
      }
  });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Successfully edited comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//COMMENT DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;