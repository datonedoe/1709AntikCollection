var Collection = require("../models/collection");
var Comment = require("../models/comment");

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCollectionOwnership = function(req, res, next){
    //is user logged in?
    if (req.isAuthenticated()){
        Collection.findById(req.params.id, function(err, foundCollection){
            if(err) {
                req.flash("error", "Collection not found");
                res.redirect("back");
            } else {
                //does user down the collection?
                // console.log(foundCollection.author.id);
                if(foundCollection.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
                
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }


}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in?
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back");
            } else {
                //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
        res.redirect("back");
    }


}

//middleware
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports  = middlewareObj;