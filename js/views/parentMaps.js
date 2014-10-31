var ParentMapsView = Backbone.View.extend({

  initialize: function(options) {
    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMap);

// TODO: why el field didn't work?
    this.$el = options.elem;
  },

  render: function() {
  	this.maps.fetch();
  },

  addMap: function(map) {
    this.$el.append(" " + map.attributes.name);
  },
});

module.exports = ParentMapsView;