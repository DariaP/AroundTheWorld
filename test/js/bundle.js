(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var Place = require('./place.js').Place;

var PlacesOnMap = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.places = options.places;
    this.mapid = options.mapid;
  },

  fetch: function(options) {
    this.reset([]);
    for (var i = 0 ; i < this.places.models.length ; ++i) {
      var place = this.places.models[i];

      if ( place.isOnMap(this.mapid)) {
        this.addPlace(place);        
      } else {
        this.listenToAdd(place);
      }
    }
  },

  addPlace: function(place) {
    this.add(place);
    this.listenToRemove(place);        
  },

  removePlace: function(place) {
    this.remove(place);
    this.listenToAdd(place);
  },

  listenToAdd: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (place.isOnMap(that.mapid)) {
        that.add(place);
      }
    });
  },

  listenToRemove: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (!place.isOnMap(that.mapid)) {
        that.remove(place);
      }
    });
  }
});

var PlacesNotOnMap = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.places = options.places;
    this.mapid = options.mapid;
  },

  fetch: function(options) {
    this.reset([]);
    for (var i = 0 ; i < this.places.models.length ; ++i) {
      var place = this.places.models[i];

      if ( place.isOnMap(this.mapid)) {
        this.listenToAdd(place);     
      } else {
        this.addPlace(place);
      }
    }
  },

  addPlace: function(place) {
    this.add(place);
    this.listenToRemove(place);        
  },

  removePlace: function(place) {
    this.remove(place);
    this.listenToAdd(place);
  },

  listenToAdd: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (! place.isOnMap(that.mapid)) {
        that.add(place);
      }
    });
  },

  listenToRemove: function(place) {
    var that = this;
    place.on('change:parentMaps', function() {
      if (place.isOnMap(that.mapid)) {
        that.remove(place);
      }
    });
  }
});

var Places = Backbone.Collection.extend({
  model: Place,
  url: 'http://localhost:8089/places',

  getMap: function(mapid) {
    return new PlacesOnMap({
      places: this,
      mapid: mapid
    });
  },

  getNotOnMap: function(mapid) {
    return new PlacesNotOnMap({
      places: this,
      mapid: mapid
    });
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
},{"./place.js":1}],3:[function(require,module,exports){
var Places = require('../../js/places.js');

var expect = chai.expect;
chai.should();

describe("#getMap", function() {
  var places, map1, notmap1;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      map1 = places.getMap(1);
      notmap1 = places.getNotOnMap(1);

      map1.fetch();
      notmap1.fetch();

      done();
    });
     
    places.fetch();

  });

  it("returns all places not in result of getNotOnMap", function() {
      expect(places.models).to.have.members(
        map1.models.concat(notmap1.models));
  });

  it("returns only places on map", function() {
      map1.models.should.all.have.deep.property('attributes.parentMaps');
      for (var i = 0 ; i < map1.models.length; ++i) {
        expect(map1.models[i].attributes.parentMaps).to.include.members([1]);
      }
  });
});

describe("#getMap", function() {
  var places, map1, newOnMap;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      map1 = places.getMap(1);
      map1.fetch();

      var notmap1 = places.getNotOnMap(1);
      notmap1.fetch();
      newOnMap = notmap1.models[0];

      newOnMap.addToMap(1);

      done();
    });
     
    places.fetch();

  });

  it("adds maps that were added to map", function() {
    expect(map1.models).to.include.members([newOnMap]);
  });

  after(function() {
    newOnMap.removeFromMap(1);
  });

});


describe("#getMap", function() {
  var places, map1, newNotOnMap;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      map1 = places.getMap(1);
      map1.fetch();

      newNotOnMap = map1.models[0];

      newNotOnMap.removeFromMap(1);

      done();
    });
     
    places.fetch();

  });

  it("remove maps that were removed from map", function() {
    expect(map1.models).to.not.include.members([newNotOnMap]);
  });

  after(function() {
    newNotOnMap.addToMap(1);
  });

});

describe("#getNotOnMap", function() {
  var places, notmap1;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      notmap1 = places.getNotOnMap(1);

      notmap1.fetch();

      done();
    });
     
    places.fetch();

  });

  it("returns only places not on map", function() {
      notmap1.models.should.all.have.deep.property('attributes.parentMaps');
      for (var i = 0 ; i < notmap1.models.length; ++i) {
        expect(notmap1.models[i].attributes.parentMaps).to.not.include.members([1]);
      }
  });
});


describe("#getNotOnMap", function() {
  var places, notmap1, newOnMap;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      notmap1 = places.getNotOnMap(1);
      notmap1.fetch();
      newOnMap = notmap1.models[0];

      newOnMap.addToMap(1);

      done();
    });
     
    places.fetch();

  });

  it("removes maps that were added to map", function() {
    expect(notmap1.models).to.not.include.members([newOnMap]);
  });

  after(function() {
    newOnMap.removeFromMap(1);
  });

});


describe("#getNotOnMap", function() {
  var places, notmap1, newNotOnMap;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      notmap1 = places.getNotOnMap(1);
      notmap1.fetch();

      var map1 = places.getMap(1);
      map1.fetch();
      newNotOnMap = map1.models[0];

      newNotOnMap.removeFromMap(1);

      done();
    });
     
    places.fetch();

  });

  it("adds maps that were removed from map", function() {
    expect(notmap1.models).to.include.members([newNotOnMap]);
  });

  after(function() {
    newNotOnMap.addToMap(1);
  });

});

},{"../../js/places.js":2}]},{},[3]);
