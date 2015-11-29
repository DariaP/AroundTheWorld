var Parse = require('../utils/parse.js');

var PlaceLocationView = Backbone.View.extend({

  events: {
    "click button.edit": "edit",
    "mouseover": "showEditButton",
    "mouseout": "hideEditButton",
    "focusout input": "save"
  },

  initialize: function() {
    var that = this;

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {

    var html = new EJS({url:             
        '/templates/placeLocation'}).render(this.model.toJSON());

    this.$el.html(html);

    return this;
  },

  showEditButton: function() {
    this.$('.edit').show();
  },

  hideEditButton: function() {
    this.$('.edit').hide();
  },

  edit: function() {
    var html = new EJS({url:             
        '/templates/editPlaceLocation'}).render(this.model.toJSON());

    this.$el.html(html);
    this.$('input').focus();
  },

  save: function() {
    this.model.set({
      location: Parse.location(this.$('input[name="location"]').val()),
    });

    this.render();
  }

});

module.exports = PlaceLocationView;