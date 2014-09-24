
var PlacesList = Backbone.Collection.extend({
  model: Place,

  fetch: function(options) {
    this.add(new Place({
      name: "Center of the World",
      location: {lat: 0, lng: 0},
      notes: "This is the center of the World"
    }));
  }    
});

var PlacesMap = Backbone.Model.extend({

  name: "",

  initialize: function(options) {
    this.places = new PlacesList();
  }
});

var PlacesMapListView = Backbone.View.extend({

  tagName:  "li",

  initialize: function() {

    this.template = _.template($('#map-template').html()),

    this.listenTo(this.model, 'change', this.render);
    this.model.places.fetch();
  },
 
  render: function() {
    var name = this.model.attributes.name;
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});