var MapsDropdownView = require('./mapsDropdown.js');

var MapView = Backbone.View.extend({
  events: {
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

    /*// TODO: maybe parent maps collection should have 'removed' event
    // and element should not clear itself on click but rather on call to 'clear' only
    this.clear();*/
  },

  clear: function() {
    this.$el.remove();
  }
});

var ParentMapsEditView = Backbone.View.extend({

  events: {
    "mouseover": "showEditButton",
    "mouseout": "hideEditButton",

    "click .edit": "showEditControls",
    "click .done": "hideEditControls"
  },

  initialize: function(options) {
    this.maps = options.maps;
    this.allMaps = options.allMaps;

    this.template = _.template($('#parent-maps-edit-template').html());

    this.edit = false;
  },

  render: function() {
    var that = this;

    this.setElement(this.template(this.model.toJSON()));

    this.maps.onEach(function(map) {
      that.addMap(map);
    });

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

    this.on('showRemoveButton', function() {
      view.showRemoveButton();
    });

    this.on('hideRemoveButton', function() {
      view.hideRemoveButton();
    });

    // we rely on this to happen when place is removed from collection
    this.model.on('removedFromMap:' + map.attributes._id, function() {
      view.clear();
    });

    this.$('ul.parent-maps').append(view.render().el);
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
      that.trigger('showRemoveButton');
    });

    this.$('.add-on-map').html(this.mapsDropdownView.render().el);
  },

  showEditButton: function() {
    if(!this.edit) {
      this.$('.edit').show();
    }
  },

  hideEditButton: function() {
    this.$('.edit').hide();
  },

  showEditControls: function() {
    this.edit = true;

    this.hideEditButton();
    this.trigger('showRemoveButton');
    this.$('.add-on-map').show();
    this.$('.done').show();
  },

  hideEditControls: function() {
    this.edit = false;

    this.trigger('hideRemoveButton');
    this.$('.add-on-map').hide();
    this.$('.done').hide();
  },

  addPlaceToMap: function(map) {
    this.model.addToMap(map.attributes._id);
    //TODO: this should happen in maps dropdown view  
    this.renderMapsDropdown();
  },

  removePlaceFromMap: function(map) {
    this.model.removeFromMap(map.attributes._id);
    //TODO: this should happen in maps dropdown view  
    this.renderMapsDropdown();
  }
});

module.exports = ParentMapsEditView;