var MapsDropdownView = require('./mapsDropdown.js');

var MapView = Backbone.View.extend({
  events: {
    "mouseover": "showRemoveButton",
    "mouseout": "hideRemoveButton",
    "click .remove" : "removeFromMap"
  },

  initialize: function(options) {
    this.template = _.template($('#parent-map-edit-template').html());
  },

  render: function() {
    var that = this;

    this.setElement(this.template(this.model.toJSON()));

    return this;
  },

  showRemoveButton: function() {
    this.$('.remove').show();
  },

  hideRemoveButton: function() {
    this.$('.remove').hide();
  },

  removeFromMap: function(e) {
    e.preventDefault();

    this.trigger('removed');
    this.clear();
  },

  clear: function() {
    this.$el.remove();
  }
});

var ParentMapsEditView = Backbone.View.extend({

  initialize: function(options) {
    this.maps = options.maps;
    this.allMaps = options.allMaps;

    this.template = _.template($('#parent-maps-edit-template').html());

    //this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    var that = this;

    this.setElement(this.template(this.model.toJSON()));

    this.listenTo(this.maps, 'add', this.addMap);

    this.renderMapsDropdown();

  	return this;
  },

  addMap: function(map) {
    var that = this;

    var view = new MapView({
      model: map
    });

    view.on('removed', function() {
      that.removePlaceFromMap(map);
    });

    this.$el.find(' > li:last-child').before(view.render().el);
  },

  renderMapsDropdown: function() {
    var that = this;

    this.mapsDropdownView = new MapsDropdownView({
      maps: this.allMaps,
      filter: function(map) {
        return ! that.model.isOnMap(map.attributes._id);
      }
    });

    this.mapsDropdownView.on('mapDropdownClicked', function(map) {
      that.addPlaceToMap(map);
      that.addMap(map);
    });

    this.$('.add-on-map').html(this.mapsDropdownView.render().el);
  },

  addPlaceToMap: function(map) {
    var newMaps = this.model.attributes.parentMaps.slice();
    newMaps.push(map.attributes._id);
    this.model.set({
      parentMaps: newMaps
    });

    this.renderMapsDropdown();
  },

  removePlaceFromMap: function(map) {
    this.model.set({
      parentMaps: _.filter(
        this.model.attributes.parentMaps,
        function (mapid) {
          return mapid != map.attributes._id;
        }
      )
    });

    this.renderMapsDropdown();
  }
});

module.exports = ParentMapsEditView;