var MapsList = require('./map.js').MapsList,
    PlacesNotOnMapList = require('./map.js').PlacesNotOnMapList,
    MapDetailsView = require('./mapDetails.js'),
    MapsListView = require('./mapsListView.js'),
    AddPlacesToMapView = require('./addPlacesToMap.js');

var MapsSidebarView = Backbone.View.extend({
  el: '#maps-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) { 
    this.places = options.places;   
    this.maps = new MapsList();
    this.hide();
  },

  render: function() {
    this.showMapsList();
  },

  showMapsList: function() {
    var view = new MapsListView({maps: this.maps}),
        that = this;

    view.on('mapClick', function(map) {
      that.showMap(map);
    });

    this.$('#content').html(view.render().el);
    this.maps.fetch();
  },

  showMap: function(map) {

    map.places = this.places.getMap(map.attributes._id);

    var view = new MapDetailsView({ model: map }),
        that = this;
    this.$('#content').html(view.render().el);

    this.once('mapReady', function(m) {
      if (m.attributes._id == map.attributes._id) {
        map.places.fetch();
      }
    });

    this.trigger('mapClick', map);

    view.on('addPlaces', function(map) {
      that.showAddPlacesList(map);
    })
  },

  showAddPlacesList: function(map) {
    var places = new PlacesNotOnMapList ({mapId: map.attributes.id}),
        that = this;

    var view = new AddPlacesToMapView ({ 
      model: map,
      places: places
    });

    view.once('done', function() {
      that.showMap(map);
    });

    this.$('#content').html(view.render().el);
    places.fetch();
  },

  hide: function() {
    this.$el.hide();    
  },

  show: function() {
    this.render();
    this.$el.show();    
  }
});

module.exports = MapsSidebarView;