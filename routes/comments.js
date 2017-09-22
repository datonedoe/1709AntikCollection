var express = require("express");
var router = express.Router({mergeParams: true});
var Collection = require("../models/collection");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // res.send("EDIT ROUTE FOR COMMENT!");
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if (err){
           res.redirect("back");
       } else {
            res.render("comments/edit", {collection_id: req.params.id, comment: foundComment});       
       }
    });
    
});


//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // res.send("You Hit The update route for comment");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log("error")
            res.redirect("back");
        } else {
            res.redirect("/collections/" + req.params.id)
        }
    });
});


//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    // res.send("THIS IS THE DESTROY COMMENT ROUTE!");
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted"); 
            res.redirect("/collections/" + req.params.id);
        }
    });
});


////////////////////////////////////
/// COMMENT ROUTE /////////////////
///////////////////////////////////

//comment new
router.get("/new", middleware.isLoggedIn, function(req, res){
    // res.send("THIS WILL BE THE COMMENT FORM");
    
    //find collection by ID
    Collection.findById(req.params.id, function(err, collection){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new",  {collection: collection});
        }
    });
});


//comment create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup collection using id
    Collection.findById(req.params.id, function(err, collection){
        if(err){
            console.log(err);
            res.redirect("/collections");
        } else{
            // console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    // console.log("New comment's username will be: " + req.user.username);
                    //save comment
                    comment.save();
                    collection.comments.push(comment);
                    collection.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment"); 
                    res.redirect("/collections/" + collection._id);
                }
            });
        }
    });
    //creating new comment
    
    //coneect to new comment to collection
    
    //redirect to collection show page
});



module.exports =router;
