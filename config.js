
var config = {
  mongoAddress: process.env.AROUNDTHEWORLD_MONGO_ADDR,
  mongoPort: process.env.AROUNDTHEWORLD_MONGO_PORT,
  mongoTravelDb: process.env.AROUNDTHEWORLD_MONGO_DBNAME,
  mongoUser: process.env.AROUNDTHEWORLD_MONGO_USERNAME,
  mongoPasswd: process.env.AROUNDTHEWORLD_MONGO_PASSWORD,
  placesCollection: "places",
  mapsCollection: "maps",
  connectionsCollection: "connections"
};

module.exports = { 
  config : config,
}
