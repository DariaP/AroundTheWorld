var MongoClient = require('mongodb').MongoClient,
    config = require('./config.js').config;

function initDb() {

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

      places.remove(function(){});
      connections.remove(function(){});
      maps.remove(function(){});

      var todo = [
        function(callback) {
          maps.insert({
            _id: '1',
            user: 'facebook_583113908494831',
            name: "Chicago"
          }, callback);
        },
        function(callback) {
          maps.insert({
            _id: '2',
            user: 'facebook_583113908494831',
            name: "Washington D.C."
          }, callback);        
        },
        function(callback) {

          maps.insert({
            _id: '3',
            user: 'facebook_583113908494831',
            name: "USA"
          }, callback);        
        },
        function(callback) {

          maps.insert({
            _id: '4',
            user: 'facebook_583113908494831',
            name: "Mountain trails"
          }, callback);        
        },
        function(callback) {

          places.insert({
            name: "Haiku Stairs",
            user: 'facebook_583113908494831',
            location: {
              lat: 21.400788,
              lng: -157.821934
            },
            notes: "Steep trail!",
            pics: ["http://cs7002.vk.me/c540103/v540103264/1e9d6/4cq4et75xmA.jpg", 
              "https://c2.staticflickr.com/8/7049/6863925343_9ac9c68bb4_z.jpg",
              "https://c2.staticflickr.com/6/5281/5298818285_985bcf0b40_z.jpg", 
              "http://lh6.ggpht.com/-0WqtCkikIAw/Ur5y02is7NI/AAAAAAAAuuw/RntKw1VQA1Q/haiku-stairs-3%25255B2%25255D.jpg"],
            parentMaps: ['3', '4'],
          }, callback);        
        },
        function(callback) {

          places.insert({
            name: "Bean",
            user: 'facebook_583113908494831',
            location: {
              lat: 41.883456,
              lng: -87.623132
            },
            notes: "",
            pics: ["http://dvogled.rs/wp-content/uploads/2014/08/chicagosculpture.jpg"], 
            parentMaps: ['1']
          }, callback);
          
        },
        function(callback) {
          places.insert({
            name: "Skydeck",
            user: 'facebook_583113908494831',
            location: {
              lat: 41.879587,
              lng: -87.636159
            },
            notes: "",
            pics: ["http://33.media.tumblr.com/2a985a4179e6cd8ab916325d79075ee4/tumblr_mw2p7hmE3X1rshyy2o1_1280.jpg"], 
            parentMaps: ['1']
          }, callback);
        },
        function(callback) {
          console.log("done");
          db.close();
        }
      ];

      var run = function(todoFuns, i) {
        todoFuns[i] ( function() {
          run(todoFuns, i + 1);
        } );
      };

      run(todo, 0);

    }
  );
}

initDb();
