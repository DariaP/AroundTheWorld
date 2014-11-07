var PlaceSidebarView = require('./placeSidebar.js'),
    MapsSidebarView = require('./mapsSidebar.js'),
    GMapView = require('./gmap.js'),
    PlaceMarkerView = require('./placeMarker.js'),
    Maps = require('../models/maps.js'),
    Places = require('../models/places.js');

var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "showMapsSidebar",
    "submit #new-place-form": "newPlace",
    "submit .search-form": "search"
  },

  initialize: function() {
    var that = this;
  
    this.worldMap = new GMapView();
    this.worldMap.on('addSearchResultClick', function(result) {
      that.setNewPlaceFields(result);
      that.openNewPlaceTab();
    });

    this.places = new Places();
    this.places.fetch();

    this.maps = new Maps();
    this.listenTo(this.maps, 'add', this.setupMap);
    this.maps.fetch();

    this.placeSidebar = new PlaceSidebarView({
      maps: this.maps
    });

    this.mapsSidebar = new MapsSidebarView({
      maps: this.maps,
      places: this.places
    });
    this.mapsSidebar.on('showMap', function(map) {
      that.resetMap(map);
      that.mapsSidebar.trigger('mapReady', map);
    });
    this.mapsSidebar.on('lookup', function(place) {
      that.worldMap.zoom(place);
    });
    this.mapsSidebar.on('showDetails', function(place) {
      that.placeSidebar.show(place);
    });
  },

  setupMap: function(map) {
    map.places = this.places.getMap(map.attributes._id);
    if (! this.currentMap) {
      this.openMap(map);
      this.currentMap.places.fetch();
    }
  },

  resetMap: function(map) {
    this.hideMap();
    this.openMap(map);  
  },

  openMap: function(map) {
    var that = this;
      // TODO: show current map name
    this.currentMap = map;
    this.currentMap.places.onEach(function(place) {
      that.addPlaceOnMap(place);
    }, this);
  },

  hideMap: function() {
    this.currentMap.places.stopOnEach(this);
    _.each(this.currentMap.places.models, function(place) {
      if (place.attributes.name) { //TODO: isn't there a better way?
        place.hide();
      }
    });
  },

  addPlaceOnMap: function(place) {
    var view = new PlaceMarkerView({model: place, worldMap: this.worldMap}),
        that = this;

    view.on("placeMarkerClick", function(place) {
      that.placeSidebar.show(place);
    });
  },

  showMapsSidebar: function() {
    this.mapsSidebar.show();
  },

// separate view?
  newPlace: function(e) {
    e.preventDefault();

    this.currentMap.places.create({
      name: this.$('#new-place-name').val(),
      location: Place.parseLocation(this.$('#new-place-location').val()),
      notes: this.$('#new-place-notes').val(),
      pics: Place.parsePics(this.$('#new-place-pics').val()),
      parentMaps: [this.currentMap.attributes._id]
    });
  },

  search: function(e) {
    e.preventDefault();
    this.worldMap.search(this.$('.search-form input').val());
  },

  setNewPlaceFields: function(place) {
    // sep view?
    this.$('#new-place-name').val(place.name);
    this.$('#new-place-location').val(place.location.lat + ", " + place.location.lng);
  },

  openNewPlaceTab: function() {
    this.$('#map-tab').removeClass("active");
    this.$('#map-tab-nav').removeClass("active");
    this.$('#new-place-tab').addClass("active");
    this.$('#new-place-tab-nav').addClass("active");
  }
});

module.exports = PageView;
