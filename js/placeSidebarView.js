var PlaceDetailsView = require('./placeDetailsView.js'),
    PlaceEditView = require('./placeEditView.js');

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
    });
    view.on('editClick', function() {
      that.edit(place);
    });

    //this.listenTo(place, 'change', this.placeChanged);

    this.$('#content').html(view.render().el);
    this.$el.show();
  },
  
  edit: function(place) {
    var view = new PlaceEditView({model: place});

    this.$('#content').html(view.render().el);
    this.$el.show();
  },


  hide: function() {
    this.$el.hide();    
  }
});

module.exports = PlaceSidebarView;