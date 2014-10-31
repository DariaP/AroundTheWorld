var PlaceDetailsView = require('./placeDetails.js'),
    PlaceEditView = require('./placeEdit.js');

var PlaceSidebarView = Backbone.View.extend({

  el: '#place-details-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {
    this.hide();
    this.maps = options.maps;
  },

  show: function(place) {
    var view = new PlaceDetailsView({model: place}),
        that = this;

    this.listenTo(place, 'change', function() {
      that.onPlaceChanged(place);
    });

    view.on('editClick', function() {
      that.edit(place);
    });

    this.$('#content').html(view.render().el);
    this.$el.show();
  },
  
  edit: function(place) {
    var view = new PlaceEditView({
      model: place,
      maps: this.maps
    });

    this.$('#content').html(view.render().el);
    this.$el.show();
  },

// TODO: change location on map if needed
  onPlaceChanged: function(place) {
    if (place.isValid() ) {
      this.show(place);
    } else {
      this.hide();
    }
  },

  hide: function() {
    this.$el.hide();    
  }
});

module.exports = PlaceSidebarView;