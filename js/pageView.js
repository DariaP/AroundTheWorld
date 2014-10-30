var PlaceSidebarView = require('./placeSidebarView.js'),
    MapsList = require('./map.js').MapsList,
    GMapView = require('./gmapView.js'),
    MapsSidebarView = require('./mapsSidebarView.js'),
    PlaceMarkerView = require('./placeMarkerView.js'),
    Place = require('./place.js'),
    Places = require('./places.js');

var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "showMapsSidebar",
    "submit #new-place-form": "newPlace",
    "submit #navbar-search-form": "search"
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

    this.maps = new MapsList();
    this.listenTo(this.maps, 'add', this.openDefaultMap);
    this.listenTo(this.maps, 'add', this.setPlaces);
    this.maps.fetch();

    this.placeSidebar = new PlaceSidebarView({
      maps: this.maps
    });

    this.mapsSidebar = new MapsSidebarView({
      maps: this.maps
    });
    this.mapsSidebar.on('mapClick', function(map) {
      that.resetMap(map);
      that.mapsSidebar.trigger('mapReady', map);
    });
  },

  setPlaces: function(map) {
    map.places = this.places.getMap(map.attributes._id);
  },

  openDefaultMap: function() {
    // TODO: show current map name
    this.openMap(this.maps.at(0));
    this.stopListening(this.maps, 'add');
    this.currentMap.places.fetch();
  },

  resetMap: function(map) {
    this.currentMap.clear();
    this.stopListening(this.currentMap.places, 'add');
    this.openMap(map);  
  },

  openMap: function(map) {
    this.currentMap = map;
    this.listenTo(this.currentMap.places, 'add', this.addPlaceOnMap);
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
    this.worldMap.search(this.$('#navbar-search-input').val());
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
