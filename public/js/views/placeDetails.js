var PicView = require('./pic.js'),
    Pic = require('../models/pic.js'),
    ParentMaps = require('../models/parentMaps.js'),
    ParentMapsEditView = require('./parentMapsEdit.js'),
    PlaceLocationView = require('./placeLocation.js'),
    PlaceNotesView = require('./placeNotes.js');

var PlaceDetailsView = Backbone.View.extend({

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

    this.showLocation();

    this.showNotes();

    this.setupCarousel();

    this.showParentMaps();

    return this;
  },

  showLocation: function() {
    var location = new PlaceLocationView({model: this.model});
    this.$('.location').html(location.render().el);
  },

  showNotes: function() {
    var notes = new PlaceNotesView({model: this.model});
    this.$('.notes').html(notes.render().el);
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

  setupCarousel: function() {
    var carousel = this.$('.visible-pics').jcarousel();

    this.$('.pics-prev')
      .on('jcarouselcontrol:inactive', function() {
        $(this).addClass('inactive');
      })
      .on('jcarouselcontrol:active', function() {
        $(this).removeClass('inactive');
      })
      .jcarouselControl({
        target: '-=1',
        carousel: carousel
      });

    this.$('.pics-next')
      .on('jcarouselcontrol:inactive', function() {
        $(this).addClass('inactive');
      })
      .on('jcarouselcontrol:active', function() {
        $(this).removeClass('inactive');
      })
      .jcarouselControl({
        target: '+=1',
        carousel: carousel
      });
  }
});

module.exports = PlaceDetailsView;