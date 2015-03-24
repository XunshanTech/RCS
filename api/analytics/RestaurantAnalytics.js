var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
// Connection URL
var url = 'mongodb://localhost:27017/rcs_mongo';

module.exports = {
  data: function(restaurantId, cb) {
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
      // Get the documents collection
      var collection = db.collection('request');
      collection.group(['_id'], {
        'Restaurant': new ObjectID(restaurantId)
      }, {'count': 0}, "function (obj, prev) { prev.count++; }", function(err, results) {
        console.log(results);
        return cb(results);
      })
    });
  }
}