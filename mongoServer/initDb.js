var mongodb = require('mongodb'),
    config = require('./config.js').config,
    server = new mongodb.Server(config.mongoAddress, config.mongoPort, { }),
    db = mongodb.Db(config.mongoTravelDb, server, {});

function initDb() {
  db.open(function (err, client) {
    if (err) { throw err; }

    var places = new mongodb.Collection(client, config.placesCollection),
        maps = new mongodb.Collection(client, config.mapsCollection),
        connections = new mongodb.Collection(client, config.connectionsCollection);

    places.remove();
    connections.remove();
    maps.remove();

    maps.insert({
      name: "Chickago"
    });
    maps.insert({
      name: "Washington D.C."
    });
    maps.insert({
      name: "USA"
    });
    maps.insert({
      name: "Mountain trails"
    });

    places.insert({
      name: "Haiku Stairs",
      location: {
        lat: 21.400788,
        lng: -157.821934
      },
      data: {
        notes: "Steep trail!",
        pics: ["http://cs7002.vk.me/c540103/v540103264/1e9d6/4cq4et75xmA.jpg", 
        "https://c2.staticflickr.com/8/7049/6863925343_9ac9c68bb4_z.jpg",
        "https://c2.staticflickr.com/6/5281/5298818285_985bcf0b40_z.jpg", 
        "http://lh6.ggpht.com/-0WqtCkikIAw/Ur5y02is7NI/AAAAAAAAuuw/RntKw1VQA1Q/haiku-stairs-3%25255B2%25255D.jpg"]
      },
      parentMaps: ["USA", "Mountain trails"]
    });

    console.log("done");

    db.close();
  });
}

initDb();
