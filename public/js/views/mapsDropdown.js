var MapView = Backbone.View.extend({

  initialize: function() {
    var that = this;

    this.template = _.template($('#dropdown-map-template').html()),
    this.listenTo(this.model, 'change', this.render);

    this.model.on('removeFromDropdown', function() {
      that.$el.remove();
    });
  },
 
  render: function() {
    this.setElement(this.template(this.model.toJSON()));
    return this;
  },
});

var MapsDropdownView = Backbone.View.extend({

  initialize: function(options) {
    this.template = _.template($('#dropdown-maps-template').html()),
    this.maps = options.maps;
    this.filter = options.filter;
  },

  render: function() {
    this.setElement(this.template());

    var that = this;

    this.maps.onEach(function(map) {
      if (that.filter(map)) {
        that.addMap(map);
      }
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

    this.$('ul').append(view.el);
  },
});

module.exports = MapsDropdownView;