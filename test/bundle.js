(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Place = Backbone.Model.extend({

  name: "",
  notes: "",
  pics: [],
  location: {lat: 0, lng: 0},
  parentMaps: [],

  initialize: function() {
    this.listenTo(this, 'change', function() { 
      if (this.isValid())
        this.save();
      });
  },

  isValid: function() {
  	return this.attributes.name != undefined;
  },

  sync: function(method, model, options) {
    return Backbone.sync(method, model, options).then(
      null, function(res) { if (res.responseJSON && res.responseJSON.err) {
        alert("Unable to add place " + this.name);
      }
    });
  },

  addToMap: function(mapid) {
    var maps = _.clone(this.attributes.parentMaps);
    maps.push(mapid);
    this.set({
      parentMaps: maps
    });
  },

  isOnMap: function(mapid) {
    return -1 != $.inArray(mapid, this.attributes.parentMaps);
  },

  hide: function() {
    this.trigger('hide');
  }
});

var parsePics = function(picsStr) {
  return picsStr.split(/[, \n]+/);
}

var parseLocation = function(locationStr) {
  var latlng = locationStr.split(/[, ]+/);
  return {
  	lat: latlng[0],
  	lng: latlng[1]
  };
}

module.exports = {
  Place: Place,
  parsePics: parsePics,
  parseLocation: parseLocation
};
},{}],2:[function(require,module,exports){
var Place = require('./place.js').Place;

var PlacesOnMap = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.places = options.places;
    this.mapid = options.mapid;
  },

  fetch: function(options) {
    this.reset([]);
    for (var i = 0 ; i < this.places.models.length ; ++i) {
      var place = this.places.models[i];

      if ( place.isOnMap(this.mapid)) {
        this.addPlace(place);        
      } else {
        this.listenToAdd(place);
      }
    }
  },

  addPlace: function(place) {
    this.add(place);
    this.listenToRemove(place);        
  },

  removePlace: function(place) {
    this.remove(place);
    this.listenToAdd(place);
  },

  listenToAdd: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (place.isOnMap(this.mapid)) {
        that.add(place);
      }
    });
  },

  listenToRemove: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (!place.isOnMap(this.mapid)) {
        that.remove(place);
      }
    });
  }
});

var PlacesNotOnMap = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.places = options.places;
    this.mapid = options.mapid;
  },

  fetch: function(options) {
    this.reset([]);
    for (var i = 0 ; i < this.places.models.length ; ++i) {
      var place = this.places.models[i];

      if ( place.isOnMap(this.mapid)) {
        this.listenToAdd(place);     
      } else {
        this.addPlace(place);
      }
    }
  },

  addPlace: function(place) {
    this.add(place);
    this.listenToRemove(place);        
  },

  removePlace: function(place) {
    this.remove(place);
    this.listenToAdd(place);
  },

  listenToAdd: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (! place.isOnMap(this.mapid)) {
        that.add(place);
      }
    });
  },

  listenToRemove: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (place.isOnMap(this.mapid)) {
        that.remove(place);
      }
    });
  }
});

var Places = Backbone.Collection.extend({
  model: Place,
  url: 'http://localhost:8089/places',

  getMap: function(mapid) {
    return new PlacesOnMap({
      places: this,
      mapid: mapid
    });
  },

  getNotOnMap: function(mapid) {
    return new PlacesNotOnMap({
      places: this,
      mapid: mapid
    });
  },

  fetch: function(options) {
    return this.fetchOnce(options);
  },

  fetchOnce: function(options) {
    var that = this;

    if (!this.fetched) {
      this.fetched = true;
      return Backbone.Collection.prototype.fetch.call(this, options).then(
        function() {
          that.trigger('ready');
        },
        function(res) {
          if (res.responseJSON && res.responseJSON.err) {
            alert("Can't get places, please try later");
          }
      }); 
    }
  }
});

module.exports = Places;
},{"./place.js":1}],3:[function(require,module,exports){
var Places = require('../js/places.js');

var expect = chai.expect;

describe("getMap and getNotOnMap divide places correctly", function() {

  it("All places are either on map or not on map", function(done) {
    var places = new Places();

    places.on('ready', function() {
      var map1 = places.getMap(1),
          notmap1 = places.getNotOnMap(1);

      map1.fetch();
      notmap1.fetch();

      expect(places.models).to.have.members(
        map1.models.concat(notmap1.models));

      done();
    });
     
    

    places.fetch();
  });

});
},{"../js/places.js":2}]},{},[3]);
