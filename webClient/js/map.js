
var PlacesMap = Backbone.Collection.extend({
  model: Place,

  fetch: function(options) {
    this.add(new Place({
      name: "Center of the World",
      location: {lat: 0, lng: 0}
    }));
  }    
});