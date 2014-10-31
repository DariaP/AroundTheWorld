var Map = require('./map.js');

var ParentMaps = Backbone.Collection.extend({
  model: Map,

  initialize: function(options) {
    this.url = 'http://localhost:8089/maps?' + 
      options.ids.map(function(id) {
        return 'ids=' + id;
      }).join('&');
  },

  fetch: function(options) {
    return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
      if (res.responseJSON && res.responseJSON.err) {
        alert("Can't get parent maps, please try later");
      }
    });
  }
});

module.exports = ParentMaps;