var Place = require('./place.js').Place;

var PlacesList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.fetched = false;
    this.url = 'http://localhost:8089/places?map=' + options.mapId;
  },

  fetch: function(options) {
    if (!this.fetched) {
      this.fetched = true;
      return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
        if (res.responseJSON && res.responseJSON.err) {
          alert("Can't get places, please try later");
        }
      }); 
    }
  }

});

var Map = Backbone.Model.extend({

  name: "",
  idAttribute: '_id',

  initialize: function(options) {

    this.setUrl();

    this.listenTo(this, 'change', function() { 
      this.save();
    });
  },

  setUrl: function() {
    this.url = 'http://localhost:8089/map?id=' + this.attributes._id;
  },

  sync: function(method, model, options) {
    var that = this;
    this.setUrl();

    return Backbone.sync(method, model, options).then(
      null,
      function(res) {
        alert("Unable to add map " + this.name);
      }
    );
  },



});

var PlacesNotOnMapList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.url = 'http://localhost:8089/places';//?nmap=' + options.mapId;
  },

  fetch: function(options) {
    return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
      if (res.responseJSON && res.responseJSON.err) {
        alert("Can't get places, please try later");
      }
    });
  }

});

var MapsList = Backbone.Collection.extend({
  model: Map,
  url: 'http://localhost:8089/maps',

  initialize: function(options) {
    this.fetched = false;
  },

  fetch: function(options) {
    if (!this.fetched) {
      this.fetched = true;
      return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
        if (res.responseJSON && res.responseJSON.err) {
          //TODO
        }
      }); 
    } else {
      console.log("maps are fetched again");
    }
  }
});

module.exports = {
  PlacesList: PlacesList,
  Map: Map,
  PlacesNotOnMapList: PlacesNotOnMapList,
  MapsList: MapsList
};