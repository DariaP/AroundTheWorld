var Place = require('./place.js').Place;

var ResultList = Backbone.Collection.extend({
  model: Place
});

var Places = Backbone.Collection.extend({
  model: Place,
  url: 'http://localhost:8089/places',

  initialize: function() {
    this.fetch();
  },

  getMap: function(mapid, map) {
    var result = new ResultList(),
        places = _.filter(
          this.models, 
          function(place) {
            return place.isOnMap(mapid);
          }
        );

    for (var i = 0 ; i < places.length ; ++i) {
      result.add(places[i]);
    }

    return result;
  },

  fetch: function(options) {
    return this.fetchOnce(options);
  },

  fetchOnce: function(options) {
    var that = this;

    if (!this.fetched) {
      this.fetched = true;
      return Backbone.Collection.prototype.fetch.call(this, options).then(
        function() {
          that.trigger('ready');
        },
        function(res) {
          if (res.responseJSON && res.responseJSON.err) {
            alert("Can't get places, please try later");
          }
      }); 
    }
  }
});

module.exports = Places;