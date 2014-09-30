var PlaceSidebarView = Backbone.View.extend({

  el: '#place-details-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function() {
    this.hide();
  },

//?
  show: function(place) {
    var view = new PlaceDetailsView({model: place}),
        that = this;
    view.on("ready", function() {
      that.$('#place-details').html(view.el);
      that.$el.show();
    });
    view.render();
  },

  hide: function() {
    this.$el.hide();    
  }
});

var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "showMapsSidebar"
  },

  initialize: function() {
    this.placeSidebar = new PlaceSidebarView();

    this.maps = new MapsList;
    this.openMap(new PlacesMap);
  
    this.worldMap = new GMapView({events: this.initGmapEvents()});
    this.mapsSidebar = new MapsListSidebarView({maps: this.maps});

    this.showCurrentMap();
  },

  initGmapEvents: function() {
    var that = this,
        gmapEvents = {};
    _.extend(gmapEvents, Backbone.Events);
    gmapEvents.on("placeMarkerClick", function(place) {
      that.placeSidebar.show(place);
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

  showMapsSidebar: function() {
    this.mapsSidebar.render();
  }
});


$(function() {

  var page = new PageView;

})
