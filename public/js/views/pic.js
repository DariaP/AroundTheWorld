var Pic = require('../models/pic.js');

var PicView = Backbone.View.extend({

  initialize: function(options) {
  },

  render: function() {
    var html = new EJS({url:             
        '/templates/picFrame'}).render(this.model.toJSON());

    this.$el.html(html);
    return this;
  },
});

module.exports = PicView;