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
      if (place.isOnMap(that.mapid)) {
        that.add(place);
      }
    });
  },

  listenToRemove: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (!place.isOnMap(that.mapid)) {
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
      if (! place.isOnMap(that.mapid)) {
        that.add(place);
      }
    });
  },

  listenToRemove: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (place.isOnMap(that.mapid)) {
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