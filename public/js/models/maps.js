var Map = require('./map.js');

var ParentMaps = Backbone.Collection.extend({
  model: Map,

  initialize: function(options) {
    this.place = options.place;
    this.maps = options.maps;
  },

  fetch: function(options) {
    return this.fetchOnce(options);
  },

  onEach: function(callback, caller) {
    _.each(
      this.models, 
      function(map) { 
        if (map.attributes.name) {
          callback(map);
        }
      }
    );

    var listener = this;
    if (caller) listener = caller;
 
    listener.listenTo(
      this, 'add', 
      function(map) {
        callback(map);
      }
    );
  },

  stopOnEach: function(caller) {
    caller.stopListening(
      this, 'add'
    );
  },

  fetchOnce: function(options) {
    var that = this;

    if (!this.fetched) {
      this.fetched = true;
      for (var i = 0 ; i < this.maps.models.length ; ++i) {
        this.checkMap(this.maps.models[i]);
      }
      this.listenTo(this.maps, 'add', this.checkMap);
    }
  },

  checkMap: function(map) {
    if ( this.place.isOnMap(map.attributes._id)) {
      this.addMap(map);        
    } else {
      this.listenToAdd(map);
    }
  },

  addMap: function(map) {
    this.add(map);
    this.listenToRemove(map);        
  },

  removeMap: function(map) {
    this.remove(map);
    this.listenToAdd(map);
  },

  listenToAdd: function(map) {
    var that = this;
    this.place.on('change:parentMaps', function() {
      if (that.place.isOnMap(map.attributes._id)) {
        that.addMap(map);
      }
    });
  },

  listenToRemove: function(map) {
    var that = this;
    this.place.on('change:parentMaps', function() {
      if (!that.place.isOnMap(map.attributes._id)) {
        that.removeMap(map);
      }
    });
  }
});

var Maps = Backbone.Collection.extend({
  model: Map,
  url: 'http://localhost:8000/maps',

  initialize: function(options) {
    this.fetched = false;
  },

  fetch: function(options) {
    if (!this.fetched) {
      this.fetched = true;
      return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
        if (res.responseJSON && res.responseJSON.err) {
          //TODO
        }
      }); 
    } else {
      console.log("maps are fetched again");
    }
  },

  getParentMaps: function(place) {
    return new ParentMaps({
      maps: this,
      place: place
    });
  },

  onEach: function(callback, caller) {
    _.each(
      this.models, 
      function(place) { 
        if (place.attributes.name) {
          callback(place);
        }
      }
    );

    var listener = this;
    if (caller) listener = caller;
 
    listener.listenTo(
      this, 'add', 
      function(place) {
        callback(place);
      }
    );
  }
});

module.exports = Maps;