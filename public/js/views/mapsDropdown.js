var MapView = Backbone.View.extend({

  initialize: function() {
    var that = this;

    this.template = _.template($('#dropdown-map-template').html()),
    this.listenTo(this.model, 'change', this.render);
  },
 
  render: function() {
    this.setElement(this.template(this.model.toJSON()));
    return this;
  },

  clear: function() {
    this.$el.remove();
  }

});

var MapsDropdownView = Backbone.View.extend({

  initialize: function(options) {
    this.template = _.template($('#dropdown-maps-template').html()),
    this.maps = options.maps;
  },

  render: function() {
    this.setElement(this.template());

    var that = this;

    this.maps.onEach(function(map) {
      that.addMap(map);
    });

    return this;
  },

  addMap: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.$el.on('click', function(e) {
      e.preventDefault();
      that.trigger('mapDropdownClicked', map);
    });

    this.maps.on('remove', function(removedMap) {
      if (map.is(removedMap)) {
        view.clear();
      };
    })

    this.$('ul').append(view.el);
  }
});

module.exports = MapsDropdownView;