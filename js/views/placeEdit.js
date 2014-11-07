var MapsDropdownView = require('./mapsDropdown.js'),
    ParentMaps = require('../models/parentMaps.js'),
    ParentMapsEditView = require('./parentMapsEdit.js'),
    Parse = require('../utils/parse.js');

var PlaceEditView = Backbone.View.extend({

  events: {
    "submit #edit-place-form": "save"
  },

  initialize: function(options) {
    this.maps = options.maps;
    this.template = _.template($('#place-edit-template').html());
    this.changes = {
      parentMaps: [],
      removedParentMaps: []
    };
  },

  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.renderMapsDropdown();

    this.renderParentMaps();

    return this;
  },

  renderMapsDropdown: function() {
    var that = this;

    this.mapsDropdownView = new MapsDropdownView({
      maps: this.maps,
      filter: function(map) {
        return ! that.model.isOnMap(map.attributes._id);
      }
    });

    this.mapsDropdownView.on('mapDropdownClicked', function(map) {
      that.addPlaceToMap(map);
    });

    this.$('#add-place-to-map-dropdown').append(
      this.mapsDropdownView.render().el
    );
  },

  renderParentMaps: function() {
    var that = this;
    
    var parentMaps = new ParentMaps({ids: this.model.attributes.parentMaps});

    this.parentMapsView = new ParentMapsEditView({
      maps: parentMaps
    });

    this.parentMapsView.on('removedFrom', function(map) {
      that.removePlaceFromMap(map);
    });

    this.$('#place-details-parent-maps').append(this.parentMapsView.render().el);

    parentMaps.fetch();
  },

  addPlaceToMap: function(map) {
    var i = this.changes.removedParentMaps.indexOf(map.attributes._id);
    if (i != -1) {
      this.changes.removedParentMaps.splice(i, 1);
    } else {
      this.changes.parentMaps.push(map.attributes._id);
    }
    this.parentMapsView.addMap(map);
    map.trigger('removeFromDropdown');
  },

  removePlaceFromMap: function(map) {
    var i = this.changes.parentMaps.indexOf(map.attributes._id);
    if (i != -1) {
      this.changes.parentMaps.splice(i, 1);
    } else {
      this.changes.removedParentMaps.push(map.attributes._id);
    }
    this.mapsDropdownView.addMap(map);
  },

  save: function(e) {
    e.preventDefault();
    var removedParentMaps = this.changes.removedParentMaps;

    var newParentMaps = _.filter(
      this.model.attributes.parentMaps.concat(this.changes.parentMaps),
      function (mapid) {
        return removedParentMaps.indexOf(mapid) == -1;
      });
    //TODO: better way?
    this.model.set({
      name: this.$('#edit-place-name').val(),
      location: Parse.location(this.$('#edit-place-location').val()),
      notes: this.$('#edit-place-notes').val(),
      pics: Parse.pics(this.$('#edit-place-pics').val()),
      parentMaps: newParentMaps
    });

    this.trigger('done');
  }
});

module.exports = PlaceEditView;