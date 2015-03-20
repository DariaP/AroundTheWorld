
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

  tagName: 'ul',
  className: 'parent-maps',

  initialize: function(options) {
    this.maps = options.maps;
  },

  render: function() {
    var that = this;

    this.listenTo(this.maps, 'add', this.addMap);

  	return this;
  },

  addMap: function(map) {
    var that = this;

    var view = new MapView({
      model: map
    });

    view.on('removed', function() {
      that.model.set({
        parentMaps: _.filter(
          that.model.attributes.parentMaps,
          function (mapid) {
            return mapid != map.attributes._id;
          })
      });
    });

    this.$el.append(view.render().el);
  },
});

module.exports = ParentMapsEditView;