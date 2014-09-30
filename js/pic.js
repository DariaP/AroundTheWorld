//?
var Pic = Backbone.Model.extend({

  src: "",

  initialize: function() {
    var loadedImage = new Image(),
        that = this;

    loadedImage.src = this.attributes.src;
    loadedImage.onload = function(e) {
      var style = "";
      if (this.width > this.height) {
        that.attributes.shorterSide='height';
      } else {
        that.attributes.shorterSide='width';
      }
      that.trigger("ready");
    };
  }
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