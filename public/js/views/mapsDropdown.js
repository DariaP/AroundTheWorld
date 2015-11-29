var MapView = Backbone.View.extend({

  initialize: function() {
    var that = this;

    this.listenTo(this.model, 'change', this.render);
  },
 
  render: function() {
    var html = new EJS({url:             
        '/templates/dropdownMap'}).render(this.model.toJSON());

    this.setElement(html);
    return this;
  },

  clear: function() {
    this.$el.remove();
  }

});

var MapsDropdownView = Backbone.View.extend({

  initialize: function(options) {
    this.maps = options.maps;
  },

  render: function() {
    var html = new EJS({url:             
        '/templates/dropdownMaps'}).render();

    this.setElement(html);

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