var express = require("express");
var router = express.Router({mergeParams: true});
var Collection = require("../models/collection");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX - show all camp ground
router.get("/", function(req, res){
    
    console.log(req.user);
    
    //Get all collections from DB
    Collection.find({}, function(err, allCollections){
        if(err){
            console.log(err);
        } else {
            res.render("collections/index", {collections: allCollections});
        }
    });
        
    // res.render("collections", {collections: collections});
});

//CREATE - add new collection to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    // /res.send("YOU HIT THE POST ROUTE");
    // get data from form ad add to collections array
    
    var name = req.body.name;
    var image =req.body.image;
    var price = req.body.price;
    var desc =req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //Create a new collection and save to database
    var newCollection = {name: name, price: price, image:image, description: desc, author: author};
    // console.log(req.user);
    
    //Create a collection and save to database
    Collection.create(newCollection, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to collections page
            console.log(newlyCreated);
            res.redirect("/")
        }
    })
    // collections.push(newCollection);
    
    
    
    
});


//NEW - show form to create new collection
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("collections/new");
});



//SHOW - shows more info about one collection
router.get("/:id", function(req, res) {
    //find the collection with provided id
    Collection.findById(req.params.id).populate("comments").exec(function(err, foundCollection){
        if (err) {
            console.log(err);
        } else {
            console.log(foundCollection);
            //render show template with that collection
            res.render("collections/show", {collection: foundCollection});
        }
    });
    
    
});

//EDIT collection ROUTE
router.get("/:id/edit", middleware.checkCollectionOwnership, function(req, res) {
        Collection.findById(req.params.id, function(err, foundCollection){
            if(err){
                console.log(err);
            } else {
                res.render("collections/edit", {collection: foundCollection});
            }
                
        })
});

//UPDATE collection ROUTE
router.put("/:id", middleware.checkCollectionOwnership,function(req, res){
    //find and update the correct collection
    Collection.findByIdAndUpdate(req.params.id, req.body.collection, function(err, updatedCollection){
        if (err){
            res.redirect("/collections");
        } else {
                
            //redirect somewhere (show page)
            res.redirect("/collections/" + req.params.id);
        }
    });

});

//DESTROY COLLECTION ROUTE
router.delete("/:id", middleware.checkCollectionOwnership, function(req, res){
    // res.send("YOU ARE TRYING TO DELETE SOMETHING!");
    Collection.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/collections");
        } else{
            res.redirect("/collections");
        }
    });
});




module.exports = router;