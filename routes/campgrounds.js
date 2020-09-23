const moment = require("moment");

let express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function (req, res) {
  // console.log(req.user);
  // Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
      if (err) {
          console.log(err);
      } else {
          res.render("campgrounds/index", { campgrounds: allCampgrounds });
      }
  });
});

//CREATE - add new campground to DB
router.post("/", function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var userId = req.user._id;
  var username = req.user.username;
  var newCampground = {
        name: name,
        image: image,
        price: price,
        description: desc,
        author: {
            id: userId,
            username: username
        },
        bFrom: req.body.bFrom,
        bTo: req.body.bTo,
        contact: req.body.contact,
        location: req.body.location
    }
  // Create a new campground and save to DB
  Campground.create(newCampground, function (err, newlyCreated) {
      if (err) {
          console.log(err);
      } else {
          //redirect back to campgrounds page
          res.redirect("/campgrounds");
      }
  });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//EDIT - show form to edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        res.render("campgrounds/edit", { campground: camp });
    });
});

//UPDATE - update existing campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        bFrom: req.body.bFrom,
        bTo: req.body.bTo,
        contact: req.body.contact,
        location: req.body.location
     }, function(err, camp) {
             res.redirect("/campgrounds/" + req.params.id);
    });
});

// DELETE - deletes a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err, deleted) {
        res.redirect("/campgrounds");
    });
});

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
      if (err || !foundCampground) {
          req.flash("error", "Campground not found");
          res.redirect("back");
      } else {
          //console.log(foundCampground)
          //render show template with that campground
          res.render("campgrounds/show", { campground: foundCampground, moment: moment });
        }
  });
});

module.exports = router;