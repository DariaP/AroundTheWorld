var MapsList = require('./map.js').MapsList,
    MapDetailsView = require('./mapDetails.js'),
    MapsListView = require('./mapsListView.js');

var MapsSidebarView = Backbone.View.extend({
  el: '#maps-sidebar',

  events: {
    "click .close": "hide",
    "click #new": "newMap"
  },

  initialize: function(options) {    
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
    this.maps.refresh();//TODO
  },

  showMap: function(map) {
    var view = new MapDetailsView({ model: map });
    this.$('#content').html(view.render().el);

    this.once('mapReady', function(m) {
      if (m.attributes._id == map.attributes._id) {
        map.places.fetch();
      }
    });

    this.trigger('mapClick', map);
  },

  showAddPlacesList: function() {

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