// add to place view?
var Pic = Backbone.Model.extend({
  src: ""
});

var PicView = Backbone.View.extend({

  initialize: function(options) {
    this.template = _.template($('#pic-link-template').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

module.exports = {
  Pic: Pic,
  PicView: PicView
};