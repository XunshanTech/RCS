var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
// Connection URL
var url = 'mongodb://localhost:27017/rcs_mongo';
var last30Date = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
module.exports = {
  data30: function(restaurantId, cb) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection('request');
      collection.group({
        'Restaurant': new ObjectID(restaurantId)
      }, {
        'Restaurant': new ObjectID(restaurantId),
        'createdAt': {
          '$gt': last30Date
        }
      }, {'old': 0, 'new': 0}, function (obj, prev) {
        var types = {
          call: [50, 50],
          water: [100, 50],
          order: [600, 0],
          pay: [200, 50]
        }
        if(typeof obj.Type !== 'undefined' && types[obj.Type]) {
          prev.old += types[obj.Type][0];
          prev.new += types[obj.Type][1];
        }
      }, function(err, results) {
        return cb(results);
      })
    });
  },
  data: function(restaurantId, cb) {
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
      // Get the documents collection
      var collection = db.collection('request');
      collection.group(function(doc) {
        var date = new Date(doc.createdAt);
        var dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return {'date': dateKey};
      }, {
        'Restaurant': new ObjectID(restaurantId),
        'createdAt': {
          '$gt': last30Date
        }
      }, {'old': 0, 'new': 0, 'count': 0}, function (obj, prev) {
        var types = {
          call: [50, 50],
          water: [100, 50],
          order: [600, 0],
          pay: [200, 50]
        }
        prev.count++;
        if(typeof obj.Type !== 'undefined' && types[obj.Type]) {
          prev.old += types[obj.Type][0];
          prev.new += types[obj.Type][1];
          prev.createdAt = obj.createdAt;
        }
      }, function(err, results) {
        results.sort(function(a, b) {
          return a.createdAt - b.createdAt;
        })
        return cb(results);
      })
    });
  }
}