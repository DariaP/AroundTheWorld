var MapView = require('./mapViews.js').asDropdownItemView;

var MapsDropdownView = Backbone.View.extend({
  //el: '#add-place-to-map-dropdown-list',

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
    var view = new MapView({model: map}).render(),
        that = this;

    view.$el.on('click', function(e) {
      e.preventDefault();
      that.trigger('mapDropdownClicked', map);
    });

    this.$el.append(view.el);
  },
});

module.exports = MapsDropdownView;