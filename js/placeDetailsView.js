var MapsDropdownView = require('./mapsDropdownView.js'),
    MapsList = require('./map.js').MapsList,
    PicView = require('./pic.js').PicView,
    Pic = require('./pic.js').Pic,
    ParentMaps = require('./parentMapsView.js').ParentMaps,
    ParentMapsView = require('./parentMapsView.js').ParentMapsView;

var PlaceDetailsView = Backbone.View.extend({

  events: {
    "click #edit": "editPlace"
  },

  initialize: function() {

    this.template = _.template($('#place-details-template').html()),
    this.listenTo(this.model, 'change', this.changed);
  },

// TODO: what about other place views?
  changed: function() {
    if(this.model.attributes.name) {
      this.render();
    } else {
      this.trigger("cleared");
    }
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