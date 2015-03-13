var Pic = require('../models/pic.js');

var PicView = Backbone.View.extend({

  initialize: function(options) {
    this.template = _.template($('#pic-link-template').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

module.exports = PicView;