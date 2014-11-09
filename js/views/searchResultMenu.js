var SearchResultMenu = Backbone.View.extend({

  className: 'search-res-menu',

  events: {
    "click .add-place"   : "addPlace",
  },

  initialize: function() {
    this.template = _.template($('#search-result-menu').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  addPlace: function(e) {
    e.preventDefault();
    this.model.trigger('addPlaceClick');
  }
});

module.exports = SearchResultMenu;