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

    this.renderMapsDropdown();

    this.renderParentMaps();

    return this;
  },

  renderMapsDropdown: function() {
    var that = this;

    var mapsDropdownView = new MapsDropdownView({
      maps: this.maps,
      filter: function(map) {
        return ! that.model.isOnMap(map.attributes._id);
      }
    });

    mapsDropdownView.on('mapDropdownClicked', function(map) {
      that.addPlaceToMap(map);
    });

    this.$('#add-place-to-map-dropdown').append(
      mapsDropdownView.render().el
    );
  },

  renderParentMaps: function() {
    
    var parentMaps = new ParentMaps({ids: this.model.attributes.parentMaps});

    this.parentMapsView = new ParentMapsView({
      maps: parentMaps
    });

    this.$('#place-details-parent-maps').append(this.parentMapsView.render().el);

    parentMaps.fetch();
  },

  addPlaceToMap: function(map) {
    this.changes.parentMaps.push(map.attributes._id);
    this.parentMapsView.addMap(map);
    map.trigger('removeFromDropdown');
  },

  removePlaceFromMap: function(map) {
    //TODO
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