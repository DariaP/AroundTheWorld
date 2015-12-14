var MapsDropdownView = require('./mapsDropdown.js');

var MapView = Backbone.View.extend({
  events: {
    "click .remove" : "removeFromMap"
  },

  initialize: function(options) {
  },

  render: function() {
    var that = this;

    var html = new EJS({url:             
        '/templates/parentMapEdit'}).render(this.model.toJSON());

    this.setElement(html);

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

    this.edit = false;
  },

  render: function() {
    var that = this;

    var html = new EJS({url:             
        '/templates/parentMapsEdit'}).render(this.model.toJSON());

    this.setElement(html);

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

    this.$('ul.parent-maps-list').append(view.render().el);
  },

  renderMapsDropdown: function() {
    var that = this;

    var allButParentMaps = this.allMaps.getAllButParentMaps(this.model);

    var mapsDropdownView = new MapsDropdownView({
      maps: allButParentMaps
    });

    mapsDropdownView.on('mapDropdownClicked', function(map) {
      that.addPlaceToMap(map);
      that.trigger('showRemoveButton');
    });

    this.$('.add-on-map').html(mapsDropdownView.render().el);

    allButParentMaps.fetch();
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
  },

  removePlaceFromMap: function(map) {
    this.model.removeFromMap(map.attributes._id);
  }
});

module.exports = ParentMapsEditView;