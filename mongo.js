var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    config = require('./config.js').config

function init(callback) {

  var url = 'mongodb://' + config.mongoUser + ':' + config.mongoPasswd +
            '@' + config.mongoAddress + 
            ':' + config.mongoPort + 
            '/' + config.mongoTravelDb;

  MongoClient.connect(url,
    function(err, db) {
      if (err) { throw err; }

      var places = db.collection(config.placesCollection),
          maps = db.collection(config.mapsCollection),
          connections = db.collection(config.connectionsCollection);

      places.ensureIndex( { "name": "" }, { unique: true }, function() {} );

      function getId(id) {
        if (id.length == 24) 
          return ObjectID.createFromHexString(id);
        else 
          return parseInt(id);
      };

      function updateExistingPlace(place, callback) {
        places.update(
          { _id:  getId(place._id) },
          { $set:  {
            name: place.name,
            location: place.location,
            notes: place.notes,
            pics: place.pics, 
            parentMaps: place.parentMaps }
          },
          {w: 1},
          function (err, result) {
            if (result == 1) {
              callback({});
            } else {
              callback({err: err});
            }
          }
        );
      };

      function addPlace(place, callback) {
        places.insert(place, {w: 1}, function(err, doc){
          if (err) {
            callback({err: err});
          } else {
            callback({_id: doc[0]._id});
          }
        });
      };

      var dbApi = {

        getPlaces: function(mapId, user, callback) {
          places.find({ user:  { $eq : user } },
            {}, {w: 1}).toArray ( function (err, res) {
            if (err) {
              callback({err: err});
            } else {
              callback(res);
            }
          });
        },

        getAllMaps: function(user, callback) {
          maps.find({ user:  { $eq : user } }, 
            {}, {w: 1}).toArray ( function (err, res) {
            if (err) {
              callback({err: err});
            } else {
              callback(res);
            }
          });
        },

        getMap: function(mapId, user, callback) {
          maps.find({ user:  { $eq : user }, _id: getId(mapId) }, 
            {}, {w: 1}).toArray ( function (err, res) {
            if (err) {
              callback({err: err});
            } else {
              callback(res[0]);
            }
          });
        },

        updatePlace: function(user, place, callback) {
          if ( ! place._id) {
            place.user = user;
            addPlace(place, callback);
          } else {
            places.find({_id: getId(place._id)}).limit(1).count(function (e, count) {
              if (count == 0) {
                addPlace(place, callback);
              } else {
                updateExistingPlace(place, callback);
              }
            });
          }
        },

        getPlacesOnMap: function(mapId, user, callback) {
          places.find(
            {
              user:  { $eq : user }, 
              parentMaps: { $all : [ getId(mapId) ]} 
            }, 
            {}, 
            {w: 1}
          ).toArray ( function (err, res) {
            if (err) {
              callback({err: err});
            } else {
              callback(res);
            }
          });
        },

        deleteMap: function(id, callback) {
          console.log(id); 
          maps.remove({_id: getId(id)}, {w: 1}, function (err, result) {
            if (result == 1) {
              callback({});
            } else {
              callback({err: err});
            }
          })
        },

        updateMap: function(map, callback) {
          maps.update(
            { _id:  getId(map._id) },
            { $set:  { name: map.name }
          },
          {w: 1},
          function (err, result) {
            if (result == 1) {
              callback({});
            } else {
              callback({err: err});
            }
          });
        },

        addMap: function (user, map, callback) {
          map.user = user;
          maps.insert(map, {w: 1}, function(err, doc) {
            if (err) {
              callback({err: err});
            } else {
              callback({_id: doc[0]._id});
            }
          });
        }

      }

      callback(dbApi);

    }
  );
}

module.exports = {
  init: init
};