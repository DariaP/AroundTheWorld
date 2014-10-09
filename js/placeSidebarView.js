var PlaceDetailsView = require('./placeDetailsView.js');

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

module.exports = PlaceSidebarView;