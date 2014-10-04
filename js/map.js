
var PlacesList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.url = 'http://localhost:8089/places?map=' + options.name;
  }
});

var Map = Backbone.Model.extend({

  name: "",

  initialize: function(options) {
    this.places = new PlacesList({name: options.name});
  },

  clear: function() {
    _.invoke(this.places.models, 'clear');
    this.places.reset();
  }

});

var MapAsListItemView = Backbone.View.extend({

  tagName:  "li",

  initialize: function() {
    this.template = _.template($('#map-template').html()),
    this.listenTo(this.model, 'change', this.render);
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

var MapAsDropdownItemView = Backbone.View.extend({

  initialize: function() {
    this.template = _.template($('#dropdown-map-template').html()),
    this.listenTo(this.model, 'change', this.render);
  },
 
  render: function() {
    this.setElement(this.template(this.model.toJSON()));
    return this;
  },
});