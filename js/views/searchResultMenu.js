var SearchResultMenu = Backbone.View.extend({

  id: 'search-res-menu',

  events: {
    "click #add-place-button"   : "addPlace",
  },

  initialize: function() {
    this.template = _.template($('#search-result-menu').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  addPlace: function(e) {
    this.model.trigger('addPlaceClick');
  }
});

module.exports = SearchResultMenu;