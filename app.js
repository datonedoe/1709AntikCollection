var express     = require('express'),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    LocalStratery = require("passport-local"),
    Collection = require("./models/collection"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB      = require("./seeds");
  
// requiring routes 
var commentRoutes = require("./routes/comments"),
    collectionRoutes = require("./routes/collections"),
    indexRoutes = require("./routes/index");
    
// var url = process.env.DATABASEURL || "mongodb://localhost/antik_v12";
var url ="mongodb://dat:123456@ds153815.mlab.com:53815/yelpcamp1993";
mongoose.connect(url);

    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
seedDB(); //seed the database
app.use(flash());


//PASPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratery(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/collections", collectionRoutes);
app.use("/collections/:id/comments",commentRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Antik Server Has Started");
});