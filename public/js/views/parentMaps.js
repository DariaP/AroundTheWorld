var ParentMapsView = Backbone.View.extend({

  initialize: function(options) {
    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMap);
  },

  render: function() {
  	return this;
  },

  addMap: function(map) {
    this.$el.append(" " + map.attributes.name);
  },
});

module.exports = ParentMapsView;