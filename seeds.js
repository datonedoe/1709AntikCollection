var mongoose = require("mongoose");
var Collection = require("./models/collection");
var Comment = require("./models/comment");
var data = [
        {name: "George T. Stagg",
        author: {
                id: mongoose.Types.ObjectId(),
                username: "Alex"
            },
            price: 9.99,
        image: "http://www.buffalotracedistillery.com/sites/default/files/Antique-GTS_0.png",
        description: "This extremely hearty whiskey ages in new charred oak barrels for no less than 15 years.  Straight out of the barrel, uncut and unfiltered, the taste is powerful, flavorful and intense. Open it up with a few drops of water, sit back and ponder the wonders of the universe."
        },
        {name: "Vintage Alhambra pendant",
        author: {
                id: mongoose.Types.ObjectId(),
                username: "Peter"
            },
            price: 9.99,
        image: "http://www.vancleefarpels.com/content/dam/rcq/vca/46/78/53/467853.png.adapt.875.875.png",
        description: "Faithful to the very first Alhambra® jewel created in 1968, the Vintage Alhambra creations by Van Cleef & Arpels are distinguished by their unique, timeless elegance. Inspired by the clover leaf, these icons of luck are adorned with a border of golden beads."
        },
        {name: "Holliday Tablecloths",
        author: {
                id: mongoose.Types.ObjectId(),
                username: "Mary"
            },
            price: 9.99,
        image: "http://clv.h-cdn.co/assets/cm/15/09/54eadf3101f2b_-_clx120108_038_1_0-de-1293835-63071482.jpg",
        description: "When introduced in 1930s, these so-called lunch cloths enabled Depression-era housewives to enliven their kitchen tables - and family's spirits - for the price of a dollar chang change. Hand-screened poinsettias grace this scallop-edged cloth by Wilendure."
            
        }
    ]
function seedDB() {
    //REMOVE ALL COLLECTION
    Collection.remove({}, function(err){
    if(err){
        console.log(err);
    } else {
        console.log("removed collection");
        
        // add a few collections
        data.forEach(function(seed){
            Collection.create(seed, function(err, collection){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a new collection");
                    
                    //create a comment
                    Comment.create(
                        {
                            text: "Interested! Give me a call!",
                            author: {
                                id: mongoose.Types.ObjectId(),
                                username: "John"
                            }
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                collection.comments.push(comment);
                                collection.save();
                                console.log("created new comment");
                            }
                            
                        });
                }
            });
        });
    }
    
    
});
}

module.exports = seedDB;