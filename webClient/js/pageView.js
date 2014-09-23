var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "openMyMapsView"
  },

  initialize: function() {
    //debugger;
    this.maps = new MapsList;
    this.openMap(new PlacesMap);

    this.worldMap = new GMapView({events: this.initGmapEvents()});
    
    this.showCurrentMap();
  },

  initGmapEvents: function() {
    var that = this,
        gmapEvents = {};
    _.extend(gmapEvents, Backbone.Events);
    gmapEvents.on("placeMarkerClick", function(place) {
      that.showPlaceDetails(place);
    });
    return gmapEvents;
  },
  openMap: function(map) {
    this.currentMap = map;
    this.listenTo(this.currentMap.places, 'add', this.addPlaceOnMap);
  },

  showCurrentMap: function() {
    this.currentMap.places.fetch();
  },

  addPlaceOnMap: function(place) {
    var view = new PlaceMapView({model: place, worldMap: this.worldMap});
  },

  showPlaceDetails: function(place) {
    var view = new PlaceDetailsView({model: place});
  },

  openMyMapsView: function() {
    var view = new MapsListSidebarView({maps: this.maps});
  }
});


$(function() {

  var page = new PageView;

})
