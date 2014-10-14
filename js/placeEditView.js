var MapsDropdownView = require('./mapsDropdownView.js'),
    MapsList = require('./map.js').MapsList,
    PicView = require('./pic.js').PicView,
    Pic = require('./pic.js').Pic,
    ParentMaps = require('./parentMapsView.js').ParentMaps,
    ParentMapsView = require('./parentMapsView.js').ParentMapsView,
    Place = require('./place.js');

var PlaceEditView = Backbone.View.extend({

  events: {
    "submit #edit-place-form": "save"
  },

  initialize: function() {
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
      maps: new MapsList(),
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
      location: Place.parseLocation(this.$('#edit-place-location').val()),
      notes: this.$('#edit-place-notes').val(),
      pics: Place.parsePics(this.$('#edit-place-pics').val()),
      parentMaps: this.model.attributes.parentMaps.concat(this.changes.parentMaps)
    });
  }
});

module.exports = PlaceEditView;