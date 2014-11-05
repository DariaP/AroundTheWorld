var MapsDropdownView = require('./mapsDropdown.js'),
    ParentMaps = require('../models/parentMaps.js'),
    ParentMapsView = require('./parentMaps.js'),
    Parse = require('../utils/parse.js');

var PlaceEditView = Backbone.View.extend({

  events: {
    "submit #edit-place-form": "save"
  },

  initialize: function(options) {
    this.maps = options.maps;
    this.template = _.template($('#place-edit-template').html());
    this.changes = {
      parentMaps: []
    };
  },

  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.startRenderingAsync();

    return this;
  },

  startRenderingAsync: function() {
    this.renderParentMaps();
    this.renderMapsDropdown();
  },

  renderMapsDropdown: function() {
    var that = this;

    var mapsDropdown = new MapsDropdownView({
      maps: this.maps,
      elem: this.$('#add-place-to-map-dropdown-list')
    });

    mapsDropdown.on('mapDropdownClicked', function(map) {
      that.addPlaceToMap(map);
    });

    mapsDropdown.render();
  },

  renderParentMaps: function() {
    this.parentMapsList = new ParentMapsView({
      maps: new ParentMaps({ids: this.model.attributes.parentMaps}),
      elem: this.$('#place-details-parent-maps')
    });
    this.parentMapsList.render();
  },

  addPlaceToMap: function(map) {
    if (-1 == $.inArray(map.attributes._id, this.model.attributes.parentMaps) &&
        -1 == $.inArray(map.attributes._id, this.changes.parentMaps)) {
      this.changes.parentMaps.push(map.attributes._id);
      this.parentMapsList.addMap(map);
    }
  },

  save: function(e) {
    e.preventDefault();

    //TODO: better way?
    this.model.set({
      name: this.$('#edit-place-name').val(),
      location: Parse.location(this.$('#edit-place-location').val()),
      notes: this.$('#edit-place-notes').val(),
      pics: Parse.pics(this.$('#edit-place-pics').val()),
      parentMaps: this.model.attributes.parentMaps.concat(this.changes.parentMaps)
    });
  }
});

module.exports = PlaceEditView;