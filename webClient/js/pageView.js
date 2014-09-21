var PageView = Backbone.View.extend({

  
  currentMap: {},

  initialize: function() {
    this.worldMap = new GMapView;
    this.openMap(new PlacesMap);
    this.currentMap.fetch();
  },

  openMap: function(map) {
    this.currentMap = map;

    this.listenTo(this.currentMap, 'add', this.addPlaceOnMap);
  },

  addPlaceOnMap: function(place) {
    var view = new PlaceMapView({model: place, map: this.worldMap.map});
  },
});


$(function() {

  var page = new PageView;

})
