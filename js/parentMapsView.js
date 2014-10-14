var Map = require('./map.js').Map;

var ParentMaps = Backbone.Collection.extend({
  model: Map,

  initialize: function(options) {
    this.url = 'http://localhost:8089/maps?' + 
      options.ids.map(function(id) {
        return 'ids=' + id;
      }).join('&');
  
    console.log(this.url);
  },

  fetch: function(options) {
    return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
      if (res.responseJSON && res.responseJSON.err) {
        alert("Can't get parent maps, please try later");
      }
    });
  }

});

var ParentMapsView = Backbone.View.extend({

  initialize: function(options) {
    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMap);

// TODO: why el field didn't work?
    this.$el = options.elem;
  },

  render: function() {
  	this.maps.fetch();
  },

  addMap: function(map) {
    this.$el.append(" " + map.attributes.name);
  },
});

module.exports = {
  ParentMapsView: ParentMapsView,
  ParentMaps: ParentMaps
};