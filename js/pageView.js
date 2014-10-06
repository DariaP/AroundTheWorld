var PlaceSidebarView = Backbone.View.extend({

  el: '#place-details-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function() {
    this.hide();
  },

  show: function(place) {
    var view = new PlaceDetailsView({model: place}),
        that = this;
    view.on('cleared', function() {
      that.hide();
    })
    this.$('#place-details').html(view.render().el);
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();    
  }
});

var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "showMapsSidebar",
    "submit #new-place-form": "newPlace"
  },

  initialize: function() {
    this.placeSidebar = new PlaceSidebarView();

    this.maps = new MapsList;
  
    this.worldMap = new GMapView({events: this.initGmapEvents()});

    this.maps.fetch();
    this.listenTo(this.maps, 'add', this.openDefaultMap);

// Share maps list?
    this.mapsSidebar = new MapsListSidebarView();
    var that = this;
    this.mapsSidebar.on('mapMenuClicked', function(map) {
      that.resetMap(map);
    });
  },

  openDefaultMap: function() {
    this.openMap(this.maps.at(0));
    this.stopListening(this.maps, 'add');
  },

  initGmapEvents: function() {
    var that = this;

    this.gmapEvents = {};

    _.extend(this.gmapEvents, Backbone.Events);

    this.gmapEvents.on("placeMarkerClick", function(place) {
      that.placeSidebar.show(place);
    });

    return this.gmapEvents;
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
    var view = new PlaceMapView({model: place, worldMap: this.worldMap});
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
      parentMaps: [this.currentMap.attributes.name]
    });
  }

});


$(function() {

  var page = new PageView;

})
