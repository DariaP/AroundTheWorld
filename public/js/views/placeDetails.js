var PicView = require('./pic.js'),
    Pic = require('../models/pic.js'),
    ParentMaps = require('../models/parentMaps.js'),
    ParentMapsEditView = require('./parentMapsEdit.js');

var PlaceDetailsView = Backbone.View.extend({

  events: {
    "click .edit": "editPlace"
  },

  initialize: function() {
    var that = this;

    this.template = _.template($('#place-details-template').html());

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {

    var that = this;

    var templateData = this.model.toJSON();
    templateData.picsHtml = this.renderPics();

    this.$el.html(this.template(templateData));

    this.showParentMaps();

    return this;
  },

  showParentMaps: function() {

    var parentMaps = new ParentMaps({ids: this.model.attributes.parentMaps});

    var parentMapsView = new ParentMapsEditView({
      maps: parentMaps
    });

    this.$('.parent-maps .property-value').html(parentMapsView.render().el);

    parentMaps.fetch();
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