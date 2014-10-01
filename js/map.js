
var PlacesList = Backbone.Collection.extend({
  model: Place,
  url: 'http://localhost:8089/getAllPlaces'
});

var Map = Backbone.Model.extend({

  name: "",

  initialize: function(options) {
    this.places = new PlacesList();
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