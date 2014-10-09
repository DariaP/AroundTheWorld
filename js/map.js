var Place = require('./place.js');

var PlacesList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.url = 'http://localhost:8089/places?map=' + options.name;
  }
});

var Map = Backbone.Model.extend({

  name: "",

  initialize: function(options) {
    this.places = new PlacesList({name: options.name});
  },

  clear: function() {
    _.invoke(this.places.models, 'clear');
    this.places.reset();
  }

});

var MapsList = Backbone.Collection.extend({
  model: Map,
  url: 'http://localhost:8089/getAllMaps'
});

module.exports = {
  PlacesList: PlacesList,
  Map: Map,
  MapsList: MapsList
};