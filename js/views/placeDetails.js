var PicView = require('./pic.js'),
    Pic = require('../models/pic.js'),
    ParentMaps = require('../models/parentMaps.js'),
    ParentMapsView = require('./parentMaps.js');

var PlaceDetailsView = Backbone.View.extend({

  events: {
    "click #edit": "editPlace"
  },

  initialize: function() {
    this.template = _.template($('#place-details-template').html());
  },

  render: function() {
    var that = this;

    var templateData = this.model.toJSON();
    templateData.picsHtml = this.renderPics();
    this.$el.html(this.template(templateData));

    var parentMapsList = new ParentMapsView({
      maps: new ParentMaps({ids: this.model.attributes.parentMaps}),
      elem: this.$('#place-details-parent-maps')
    }).render();

    return this;
  },

  renderPics: function() {
    var pics = this.model.attributes.pics,
        html = "";

    for (var i = 0 ; i < pics.length ; ++i) {
      var pic = new Pic({src: pics[i]})
      var picHtml = new PicView({model: pic}).render().$el.html();
      html += picHtml;
    }
    return html;
  },

  editPlace: function() {
    this.trigger('editClick');
  }
});

module.exports = PlaceDetailsView;