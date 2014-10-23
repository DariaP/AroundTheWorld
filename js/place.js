var Place = Backbone.Model.extend({

  name: "",
  notes: "",
  pics: [],
  location: {lat: 0, lng: 0},
  parentMaps: [],

  initialize: function() {
    this.listenTo(this, 'change', function() { 
      if (this.isValid())
        this.save();
      });
  },

  isValid: function() {
  	return this.attributes.name != undefined;
  },

  sync: function(method, model, options) {
    return Backbone.sync(method, model, options).then(
      null, function(res) { if (res.responseJSON && res.responseJSON.err) {
        alert("Unable to add place " + this.name);
      }
    });
  },

  addToMap: function(mapid) {
    var maps = _.clone(this.attributes.parentMaps);
    maps.push(mapid);
    this.set({
      parentMaps: maps
    });
  },
  
  removeFromMap: function(mapid) {
    var maps = _.filter(
      this.attributes.parentMaps, 
      function(id) {
        return id !== mapid;
      }
    );

    this.set({
      parentMaps : maps
    });
  },

  isOnMap: function(mapid) {
    return -1 != $.inArray(mapid, this.attributes.parentMaps);
  },

  hide: function() {
    this.trigger('hide');
  }
});

var parsePics = function(picsStr) {
  return picsStr.split(/[, \n]+/);
}

var parseLocation = function(locationStr) {
  var latlng = locationStr.split(/[, ]+/);
  return {
  	lat: latlng[0],
  	lng: latlng[1]
  };
}

module.exports = {
  Place: Place,
  parsePics: parsePics,
  parseLocation: parseLocation
};