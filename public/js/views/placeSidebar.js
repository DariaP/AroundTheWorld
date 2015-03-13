var PlaceDetailsView = require('./placeDetails.js'),
    PlaceEditView = require('./placeEdit.js');

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
    var view = new PlaceDetailsView({model: place}),
        that = this;

    view.on('editClick', function() {
      that.edit(place);
    });

    this.$('.content').html(view.render().el);
    this.$el.show();
  },
  
  edit: function(place) {
    var that = this;

    var view = new PlaceEditView({
      model: place,
      maps: this.maps
    });

    view.on('done', function() {
      that.show(place);
    });

    this.$('.content').html(view.render().el);
  },

// TODO: change location on map if needed
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