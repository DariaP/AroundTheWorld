var PicView = require('./pic.js'),
    Pic = require('../models/pic.js'),
    ParentMapsEditView = require('./parentMapsEdit.js'),
    PlaceLocationView = require('./placeLocation.js'),
    PlaceNotesView = require('./placeNotes.js');

var PlaceDetailsView = Backbone.View.extend({

  events: {
    "click .place-name button.edit": "editName",
    "mouseover .place-name": "showEditButton",
    "mouseout .place-name": "hideEditButton",
    "focusout input.name-edit": "saveName"
  },

  initialize: function(options) {
    var that = this;

    this.maps = options.maps;
  },

  render: function() {

    var that = this;

    var templateData = this.model.toJSON();
    templateData.picsHtml = this.renderPics();

    var html = new EJS({url:             
        '/templates/placeDetails'}).render(templateData);

    this.$el.html(html);

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

  showEditButton: function() {
    this.$('.place-name .edit').show();
  },

  hideEditButton: function() {
    this.$('.place-name .edit').hide();
  },

  editName: function() {

    var html = new EJS({url:             
        '/templates/editPlaceName'}).render(this.model.toJSON());

    this.$('.place-name').html(html);
    this.$('.place-name input').focus();
  },

  saveName: function() {
    this.model.set({
      name: this.$('input[name="name"]').val()
    });

    this.render();
  },

  showParentMaps: function() {

    var parentMaps = this.maps.getParentMaps(this.model);

    var parentMapsView = new ParentMapsEditView({
      maps: parentMaps,
      model: this.model,
      allMaps: this.maps
    });

    this.$('.parent-maps.property').html(parentMapsView.render().el);

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