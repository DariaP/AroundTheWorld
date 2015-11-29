var SearchResultMenu = Backbone.View.extend({

  className: 'search-res-menu',

  events: {
    "click .add-place"   : "addPlace",
  },

  initialize: function() {
  },

  render: function() {
    var html = new EJS({url:             
        '/templates/searchResultMenu'}).render(this.model.toJSON());

    this.$el.html(html);
    return this;
  },

  addPlace: function(e) {
    e.preventDefault();
    this.model.trigger('addPlaceClick');
  }
});

module.exports = SearchResultMenu;