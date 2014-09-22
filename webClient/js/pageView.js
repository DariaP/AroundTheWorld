var PageView = Backbone.View.extend({

  initialize: function() {
    this.events = {};
    _.extend(this.events, Backbone.Events);

    var that = this;
    this.events.on("placeMarkerClick", function(place) {
      that.showPlaceDetails(place);
    });

    this.worldMap = new GMapView({events: this.events});

    this.openMap(new PlacesMap);

    this.currentMap.fetch();
  },

  openMap: function(map) {
    this.currentMap = map;

    this.listenTo(this.currentMap, 'add', this.addPlaceOnMap);
  },

  addPlaceOnMap: function(place) {
    var view = new PlaceMapView({model: place, worldMap: this.worldMap});
  },

  showPlaceDetails: function(place) {
    var view = new PlaceDetailsView({model: place});
  }
});


$(function() {

  var page = new PageView;

})
