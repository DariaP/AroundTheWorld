var Place = require('./place.js');

var PlacesList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.url = 'http://localhost:8089/places?map=' + options.mapId;
  }
});

var Map = Backbone.Model.extend({

  name: "",

  initialize: function(options) {
    this.places = new PlacesList({mapId: options._id});
  },

  clear: function() {
    _.invoke(this.places.models, 'clear');
    this.places.reset();
  }

});

var MapsList = Backbone.Collection.extend({
  model: Map,
  url: 'http://localhost:8089/maps'
});

module.exports = {
  PlacesList: PlacesList,
  Map: Map,
  MapsList: MapsList
};