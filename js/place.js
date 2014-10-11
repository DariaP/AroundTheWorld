var Place = Backbone.Model.extend({

  name: "",
  notes: "",
  pics: [],
  location: {lat: 0, lng: 0},
  parentMaps: [],

  addOnMap: function(map) {
    this.save({parentMaps: this.get("parentMaps") + map});
  },

  sync: function(method, model, options) {
    return Backbone.sync(method, model, options).then(null, function(res) {
      if (res.responseJSON && res.responseJSON.err) {
        alert("Unable to add place " + this.name);
      }
    });
  }

});

module.exports = Place;