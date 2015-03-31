var PlaceDetailsView = require('./placeDetails.js');

var PlaceSidebarView = Backbone.View.extend({

  el: '.place-details',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {
    this.hide();
    this.maps = options.maps;
  },

  show: function(place) {
    var view = new PlaceDetailsView({
          model: place,
          maps: this.maps
        }),
        that = this;

    this.$('.content').html(view.render().el);
    this.$el.show();
  },

  onPlaceChanged: function(place) {
    if ( ! place.isValid() ) {
      this.hide();
    }
  },

  hide: function() {
    this.$el.hide();    
  }
});

module.exports = PlaceSidebarView;