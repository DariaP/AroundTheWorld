var Place = require('./place.js');

var PlacesList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.fetched = false;
    this.url = 'http://localhost:8089/places?map=' + options.mapId;
  },

  fetch: function(options) {
    if (!this.fetched) {
      this.fetched = true;
      return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
        if (res.responseJSON && res.responseJSON.err) {
          alert("Can't get places, please try later");
        }
      }); 
    }
  }

});

var Map = Backbone.Model.extend({

  name: "",
  idAttribute: '_id',

  initialize: function(options) {

    this.setUrl();

    this.listenTo(this, 'change', function() { 
      this.save();
    });
  },

  setUrl: function() {
    this.url = 'http://localhost:8089/map?id=' + this.attributes._id;
  },

  sync: function(method, model, options) {
    var that = this;
    this.setUrl();

    return Backbone.sync(method, model, options).then(
      null,
      function(res) {
        alert("Unable to add map " + this.name);
      }
    );
  },
});

module.exports = Map;