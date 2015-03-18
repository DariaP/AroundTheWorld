var Parse = require('../utils/parse.js');

var PlaceLocationView = Backbone.View.extend({

  events: {
    "click table": "edit",
    "focusout input": "save"
  },

  initialize: function() {
    var that = this;

    this.template = _.template($('#place-location-template').html());
    this.editTemplate = _.template($('#edit-place-location-template').html());

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {

    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  edit: function() {
    this.$el.html(this.editTemplate(this.model.toJSON()));
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