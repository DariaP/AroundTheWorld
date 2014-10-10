var PlaceSidebarView = require('./placeSidebarView.js'),
    MapsList = require('./map.js').MapsList,
    GMapView = require('./gmapView.js'),
    MapsSidebarView = require('./mapsSidebarView.js'),
    PlaceMarkerView = require('./placeMarkerView.js');

var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "showMapsSidebar",
    "submit #new-place-form": "newPlace",
    "submit #navbar-search-form": "search"
  },

  initialize: function() {
    var that = this;

    this.placeSidebar = new PlaceSidebarView();

    this.maps = new MapsList();
  
    this.worldMap = new GMapView();
    this.worldMap.on('addSearchResultClick', function(result) {
      that.setNewPlaceFields(result);
      that.openNewPlaceTab();
    });

    this.maps.fetch();
    this.listenTo(this.maps, 'add', this.openDefaultMap);

// Share maps list?
    this.mapsSidebar = new MapsSidebarView();
    var that = this;
    this.mapsSidebar.on('mapMenuClicked', function(map) {
      that.resetMap(map);
    });
  },

  openDefaultMap: function() {
    this.openMap(this.maps.at(0));
    this.stopListening(this.maps, 'add');
  },

  resetMap: function(map) {
    this.currentMap.clear();
    this.stopListening(this.currentMap.places, 'add');
    this.openMap(map);  
  },

  openMap: function(map) {
    this.currentMap = map;
    this.listenTo(this.currentMap.places, 'add', this.addPlaceOnMap);
    this.currentMap.places.fetch();
  },

  addPlaceOnMap: function(place) {
    var view = new PlaceMarkerView({model: place, worldMap: this.worldMap}),
        that = this;

    view.on("placeMarkerClick", function(place) {
      that.placeSidebar.show(place);
    });
  },

  showMapsSidebar: function() {
    this.mapsSidebar.render();
    this.mapsSidebar.show();
  },

// separate view?
  newPlace: function(e) {
    e.preventDefault();

    var latlng = this.$('#new-place-location').val().split(/[, ]+/),
        pics = this.$('#new-place-pics').val().split(/[, \n]+/);

    this.currentMap.places.create({
      name: this.$('#new-place-name').val(),
      location: {
        lat: latlng[0],
        lng: latlng[1]
      },
      notes: this.$('#new-place-notes').val(),
      pics: pics,
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
