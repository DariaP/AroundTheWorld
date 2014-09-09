var mongodb = require('mongodb'),
    config = require('./config.js').config,
    server = new mongodb.Server(config.mongoAddress, config.mongoPort, { }),
    db = mongodb.Db(config.mongoTravelDb, server, {});

function initDb() {
  db.open(function (err, client) {
    if (err) { throw err; }

    var places = new mongodb.Collection(client, config.placesCollection),
        connections = new mongodb.Collection(client, config.connectionsCollection);

    places.remove();
    connections.remove();

    places.insert({
      name: "Haiku Stairs",
      location: {
        lat: 21.400788,
        lng: -157.821934
      },
      data: {
        notes: "Steep trail!",
        pics: ["http://cs7002.vk.me/c540103/v540103264/1e9d6/4cq4et75xmA.jpg"]
      }
    });

    console.log("done");

    db.close();
  });
}

initDb();
