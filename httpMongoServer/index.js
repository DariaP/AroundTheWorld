var mongodb = require('mongodb'),
    config = require('./config.js').config
 
function initNetwork(dbApi) {

  var http = require("http"),
      url = require("url");
  var server = http.createServer(function(request, response) {
    var parsedReq = url.parse(request.url, true);
    var command = parsedReq.pathname.substr(1),
        params = parsedReq.query;

    if (dbApi[command]) {
      dbApi[command](params, function(result) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify([result]));
      });
    }
  });

  server.listen(8089);
}

function initDb(callback) {
  var server = new mongodb.Server(config.mongoAddress, config.mongoPort, { }),
      db = mongodb.Db(config.mongoTravelDb, server, {});

  db.open(function (err, client) {
    if (err) { throw err; }

    var places = new mongodb.Collection(client, config.placesCollection),
        maps = new mongodb.Collection(client, config.mapsCollection),
        connections = new mongodb.Collection(client, config.connectionsCollection);

    function normPlace(place) {
      if(!place.notes) place.notes="";
      if(!place.parentMaps) place.parentMaps=[];
      if(!place.pics) 
        place.pics=[];
      else
        place.pics = place.pics.split(/[, \n]+/);

      var latlng = place.location.split(/[, ]+/);
      place.location = {lat: parseInt(latlng[0]), lng: parseInt(latlng[1])}

      return place;
    }
    var dbApi = {
      getAllPlaces: function(params, callback) {
      	places.find({}, {}).toArray ( function (err, res) {
          callback(res);
      	})
      },
      addPlace: function(params, callback) {
        places.insert(normPlace(params));
        callback({result: 'done'});
      },
      addPlaceOnMap: function (params, callback) {
        places.update(
          { name: params.place },
          { $push: { parentMaps: params.map }}
        );
        callback({result: 'done'});
      },
      getAllMaps: function(params, callback) {
        maps.find({}, {}).toArray ( function (err, res) {
            callback(res);
        })
      },
      getPlacesOnMap: function(params, callback) {
        places.find({parentMaps: { $all : [params.map]} }, {}).toArray ( function (err, res) {
          callback(res);
        });
      }
    }

    callback(dbApi)
  });
}

initDb(function(dbApi) {
  initNetwork(dbApi)
});
