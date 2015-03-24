var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/rcs_mongo';

module.exports = {
  data: function(cb) {
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
      // Get the documents collection
      var collection = db.collection('restaurant');
      collection.find({}).toArray(function(err, docs) {
        cb(docs);
      })
    });
    return {
      name: 'test1'
    }
  }
}