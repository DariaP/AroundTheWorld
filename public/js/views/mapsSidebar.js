var MapDetailsView = require('./mapDetails.js'),
    MapsListView = require('./mapsList.js'),
    AddPlacesToMapView = require('./addPlacesToMap.js');

var MapsSidebarView = Backbone.View.extend({
  el: '.maps',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {  
    this.maps = options.maps;
    this.places = options.places;
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

    this.$('.content').html(view.render().el);
  },

  showMap: function(map) {

    var view = new MapDetailsView({ model: map }),
        that = this;

    this.$('.content').html(view.render().el);

    this.once('mapReady:' + map.attributes._id, function() {
      map.places.fetch();
    });

    this.trigger('showMap', map);

    view.on('lookup', function(place) {
      that.trigger('lookup', place);
    });

    view.on('showDetails', function(place) {
      that.trigger('showDetails', place);
    });

    view.on('addPlaces', function(map) {
      that.showAddPlacesList(map);
    })
  },

  showAddPlacesList: function(map) {
    var places = this.places.getNotOnMap(map.attributes._id),
        that = this;

    var view = new AddPlacesToMapView ({ 
      model: map,
      places: places
    });

    view.once('done', function() {
      that.showMap(map);
    });

    this.$('.content').html(view.render().el);
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