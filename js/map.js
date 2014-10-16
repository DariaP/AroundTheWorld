var Place = require('./place.js').Place;

var PlacesList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.url = 'http://localhost:8089/places?map=' + options.mapId;
  },

  fetch: function(options) {
    return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
      if (res.responseJSON && res.responseJSON.err) {
        alert("Can't get places, please try later");
      }
    });
  }

});

var Map = Backbone.Model.extend({

  name: "",
  idAttribute: '_id',

  initialize: function(options) {

    this.places = new PlacesList({mapId: options._id});

    this.url = 'http://localhost:8089/map?id=' + this.attributes._id;

    this.listenTo(this, 'change', function() { 
      this.save();
    });
  },

  clear: function() {
    _.invoke(this.places.models, 'clear');
    this.places.reset();
  },

});

var MapsList = Backbone.Collection.extend({
  model: Map,
  url: 'http://localhost:8089/maps',

  refresh: function() {
    this.reset([]);
    this.fetch();
  }
});

module.exports = {
  PlacesList: PlacesList,
  Map: Map,
  MapsList: MapsList
};