(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function () {
  var PageView = require('./views/page.js');
  new PageView();
});
},{"./views/page.js":14}],2:[function(require,module,exports){
var Place = require('./place.js');

var PlacesList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.fetched = false;
    this.url = 'http://localhost:8000/places?map=' + options.mapId;
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
    this.url = 'http://localhost:8000/map?id=' + this.attributes._id;
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

  is: function(map) {
    return this.attributes._id === map.attributes._id;
  }
});

module.exports = Map;
},{"./place.js":5}],3:[function(require,module,exports){
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
    this.place.on('addedToMap:' + map.attributes._id, function() {
      that.addMap(map);
    });
  },

  listenToRemove: function(map) {
    var that = this;
    this.place.on('removedFromMap:' + map.attributes._id, function() {
      that.removeMap(map);
    });
  }
});

var AllButParentMaps = Backbone.Collection.extend({
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
    if ( ! this.place.isOnMap(map.attributes._id)) {
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
    this.place.on('removedFromMap:' + map.attributes._id, function() {
      that.addMap(map);
    });
  },

  listenToRemove: function(map) {
    var that = this;
    this.place.on('addedToMap:' + map.attributes._id, function() {
      that.removeMap(map);
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

  getAllButParentMaps: function(place) {
    return new AllButParentMaps({
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
},{"./map.js":2}],4:[function(require,module,exports){
var Pic = Backbone.Model.extend({
  src: ""
});

module.exports = Pic;
},{}],5:[function(require,module,exports){
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
    var that = this;
    return Backbone.sync(method, model, options).then(
      null, function(res) { if (res.responseJSON && res.responseJSON.err) {
        alert("Unable to save place " + that.attributes.name);
      }
    });
  },

  addToMap: function(mapid) {
    var maps = _.clone(this.attributes.parentMaps);
    maps.push(mapid);
    this.set({
      parentMaps: maps
    });

    this.trigger('addedToMap:' + mapid);
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

    this.trigger('removedFromMap:' + mapid);
  },

  isOnMap: function(mapid) {
    return -1 != $.inArray(mapid, this.attributes.parentMaps);
  },

  hide: function() {
    this.trigger('hiden');
  }
});

module.exports = Place;
},{}],6:[function(require,module,exports){
var Place = require('./place.js');

var PlacesOnMap = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.places = options.places;
    this.mapid = options.mapid;
  },

  fetch: function(options) {
    return this.fetchOnce(options);
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
      for (var i = 0 ; i < this.places.models.length ; ++i) {
        this.checkPlace(this.places.models[i]);
      }
      this.listenTo(this.places, 'add', this.checkPlace);
    }
  },

  checkPlace: function(place) {
    if ( place.isOnMap(this.mapid)) {
      this.addPlace(place);        
    } else {
      this.listenToAdd(place);
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
    place.on('addedToMap:' + this.mapid, function() {
      that.addPlace(place);
    });
  },

  listenToRemove: function(place) {
    var that = this;
    place.on('removedFromMap:' + this.mapid, function() {
      that.removePlace(place);
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

      for (var i = 0 ; i < this.places.models.length ; ++i) {
        this.checkPlace(this.places.models[i]);
      }
      this.listenTo(this.places, 'add', this.checkPlace);
    }
  },

  checkPlace: function(place) {
    if ( place.isOnMap(this.mapid)) {
      this.listenToAdd(place);     
    } else {
      this.addPlace(place);
    }
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
    place.on('removedFromMap:' + this.mapid, function() {
      that.addPlace(place);
    });
  },

  listenToRemove: function(place) {
    var that = this;
    place.on('addedToMap:' + this.mapid, function() {
      that.removePlace(place);
    });
  }
});

var Places = Backbone.Collection.extend({
  model: Place,
  url: 'http://localhost:8000/places',

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
},{"./place.js":5}],7:[function(require,module,exports){

var parsePics = function(picsStr) {
  if (picsStr.length == 0)
  	return [];
  else
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
  location: parseLocation,
  pics: parsePics
};
},{}],8:[function(require,module,exports){
var PlaceView = Backbone.View.extend({
  events: {
    'click [type="checkbox"]': 'checkboxClicked'
  },

  initialize: function(options) {
    this.mapid = options.mapid;
    this.template = _.template($('#add-place-template').html());
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  checkboxClicked: function(e) {
    if (this.checked) {
      this.checked = false
      this.trigger('unchecked');
    } else {
      this.checked = true
      this.trigger('checked');
    }
  }
});

var AddPlacesToMapView = Backbone.View.extend({

  events: {
    'click .save': 'save'
  },

  initialize: function(options) {
    this.places = options.places;
    this.template = _.template($('#add-places-template').html());
    this.newPlaces = {};
  },

  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.places.onEach(function(place) {
      that.addPlace(place);
    });

    return this;
  },

  addPlace: function(place) {
    var view = new PlaceView({
      model: place,
      mapid: this.model.attributes._id
    });
    var that = this;

    view.on('checked', function() {
      that.newPlaces[place.attributes._id] = place;
    });
    view.on('unchecked', function() {
      that.newPlaces[place.attributes._id] = undefined;
    });

    this.$('ul').append(view.render().el);
  },

  save: function(e) {
    for(id in this.newPlaces) {
      if (this.newPlaces[id]) {
        this.newPlaces[id].addToMap(this.model.attributes._id);
      }
    }
    this.trigger('done');
  }
});

module.exports = AddPlacesToMapView;
},{}],9:[function(require,module,exports){
var Place = require('../models/place.js'),
    PlaceMarkerView = require('./placeMarker.js');

var GMapView = Backbone.View.extend({

  mapOptions: {
    center: new google.maps.LatLng(0, 0),
    zoom: 3
  },

  initialize: function(options) {

    this.map = new google.maps.Map(
      document.querySelector(".map-canvas"),
      this.mapOptions
      );

    this.placesSearchService = new google.maps.places.PlacesService(this.map);

    var autocomplete = new google.maps.places.Autocomplete(
      document.querySelector(".search-form input"));
  },

  search: function(searchText) {
    var that = this,
        request = {
          query: searchText
        };

    this.trigger('newSearch');

    this.placesSearchService.textSearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          that.createSearchMarker(results[i]);
        }
      }
    });
  },

  createSearchMarker: function(result) {

    var that = this,
        place = new Place({
          name: result.formatted_address,
          location: {
            lat: result.geometry.location.k, 
            lng: result.geometry.location.B
          },
          pics: [],
          notes: "",
          parentMaps: []
        });

    var marker = new PlaceMarkerView({
      model: place,
      worldMap: this,
      color: '78FF69'}
    );

    this.once('newSearch', function() { 
      marker.clear();
    });

    marker.on('placeMarkerClick', function() {
      marker.showInfo();
    }),

    place.on('addPlaceClick', function() {
      that.trigger('addSearchResultClick', place.attributes);
    })
  },

  zoom: function(place) {
    this.map.setCenter(new google.maps.LatLng(
      place.attributes.location.lat,
      place.attributes.location.lng
    ));
  }
});

module.exports = GMapView;
},{"../models/place.js":5,"./placeMarker.js":19}],10:[function(require,module,exports){
var PlaceView = Backbone.View.extend({
  events: {
    "click .remove" : "removeFromMap",
    "click .lookup" : "lookup",
    "click a" : "showDetails"
  },

  initialize: function(options) {
    this.mapid = options.mapid;
    this.template = _.template($('#place-template').html());
  },
 
  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  removeFromMap: function(e) {
    var that = this;

    e.preventDefault();

    this.model.removeFromMap(this.mapid);
  },

  clear: function() {
    this.$el.remove();
  },

  lookup: function() {
    this.trigger('lookup');
  },

  showDetails: function() {
    this.trigger('showDetails');
  },
});

var MapDetailsView = Backbone.View.extend({

  events: {
    "click .add" : "onAddClick"
  },

  initialize: function() {
    this.template = _.template($('#map-details-template').html());
  },
 
  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.model.places.onEach(function(place) {
      that.addPlace(place);
    });

    return this;
  },

  addPlace: function(place) {
    var that = this;

    var view = new PlaceView({
      model: place,
      mapid: this.model.attributes._id
    });

    view.on('lookup', function() {
      that.trigger('lookup', place);
    });

    view.on('showDetails', function() {
      that.trigger('showDetails', place);
    });

    // we rely on this to happen when place is removed from collection
    place.on('removedFromMap:' + this.model.attributes._id, function() {
      view.clear();
    });

    this.$('ul').append(view.render().el);
  },

  onAddClick: function(e) {
    e.preventDefault();
    this.trigger('addPlaces', this.model);
  }
});

module.exports = MapDetailsView;
},{}],11:[function(require,module,exports){
var MapView = Backbone.View.extend({

  initialize: function() {
    var that = this;

    this.template = _.template($('#dropdown-map-template').html()),
    this.listenTo(this.model, 'change', this.render);
  },
 
  render: function() {
    this.setElement(this.template(this.model.toJSON()));
    return this;
  },

  clear: function() {
    this.$el.remove();
  }

});

var MapsDropdownView = Backbone.View.extend({

  initialize: function(options) {
    this.template = _.template($('#dropdown-maps-template').html()),
    this.maps = options.maps;
  },

  render: function() {
    this.setElement(this.template());

    var that = this;

    this.maps.onEach(function(map) {
      that.addMap(map);
    });

    return this;
  },

  addMap: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.$el.on('click', function(e) {
      e.preventDefault();
      that.trigger('mapDropdownClicked', map);
    });

    this.maps.on('remove', function(removedMap) {
      if (map.is(removedMap)) {
        view.clear();
      };
    })

    this.$('ul').append(view.el);
  }
});

module.exports = MapsDropdownView;
},{}],12:[function(require,module,exports){
var MapView = Backbone.View.extend({

  tagName:  "li",
  
  events: {
    "click .delete" : "onDeleteClick",
    "click .edit" : "onEditClick",
    "click a" : "onLinkClick",
    "click .save" : 'onSaveClick'
  },

  initialize: function() {
    // TODO: split?
 
    this.template = _.template($('#map-template').html());
    this.editTemplate = _.template($('#edit-map-template').html());
    this.listenTo(this.model, 'destroy', this.clear);
    this.listenTo(this.model, 'changed', this.render);
  },

  render: function() {
    // TODO: what if name is too long to fit?
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  clear: function() {
    this.$el.remove();
  },

  onDeleteClick: function(e) {
    e.preventDefault();
    this.model.destroy({
      error: function() {
        ;//TODO
      }
    });
  },

  onEditClick: function(e) {
    e.preventDefault();
    this.edit();
  },

  onLinkClick: function(e) {
    e.preventDefault();
    this.trigger('mapClick');
  },

  onSaveClick: function(e) {
    e.preventDefault();
    this.save();
  },

  edit: function() {
    this.$el.html(this.editTemplate(this.model.toJSON()));
  },

  save: function() {
    this.model.set({
      name : this.$('input[name="name"]').val()
    });
    this.render();
    // TODO: why does this work? o_O
    this.trigger('refreshed');
  }
});

var NewMapView = Backbone.View.extend({
  events: {
    "click .save" : 'onSaveClick'
  },

  initialize: function(options) {
    this.template = _.template($('#new-map-template').html());
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  onSaveClick: function(e) {
    e.preventDefault();
    this.trigger('newMap', this.$('input[name="name"]').val());
    this.$el.remove();
  }
});

var MapsListView = Backbone.View.extend({

  events: {
    "click .new": "newMap"
  },

  initialize: function(options) {
    this.template = _.template($('#maps-list-template').html());

    this.maps = options.maps;
  },

  render: function() {
    var that = this;

    this.$el.html(this.template());

    this.maps.onEach(function(map) {
      that.addMapToList(map);
    });

    return this;
  },

  addMapToList: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.on('mapClick', function() {
      that.trigger('mapClick', map);
    });

    view.on('refreshed', function() {
      that.$el.hide().fadeIn('fast');
    })

    this.$('ul').append(view.el);
  },

  newMap: function(e) {

    var that = this;

    e.preventDefault();

    if (!this.addingNew) {
      this.addingNew = true;

      var view = new NewMapView();
      this.$('ul').before(view.render().el);

      view.once('newMap', function(name) {
        that.addMap(name);
      })
    }
  },

  addMap: function(name) {
    this.addingNew = false;
    this.maps.create({
      name: name
    });
  }

});

module.exports = MapsListView;
},{}],13:[function(require,module,exports){
var MapDetailsView = require('./mapDetails.js'),
    MapsListView = require('./mapsList.js'),
    AddPlacesToMapView = require('./addPlacesToMap.js');

var MapsSidebarView = Backbone.View.extend({
  el: '.maps',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {  
    this.maps = options.maps;
    this.places = options.places;
    this.hide();
  },

  render: function() {
    this.showMapsList();
  },

  showMapsList: function() {
    var view = new MapsListView({maps: this.maps}),
        that = this;

    view.on('mapClick', function(map) {
      that.showMap(map);
    });

    this.$('.content').html(view.render().el);
  },

  showMap: function(map) {

    var view = new MapDetailsView({ model: map }),
        that = this;

    this.$('.content').html(view.render().el);

    this.once('mapReady:' + map.attributes._id, function() {
      map.places.fetch();
    });

    this.trigger('showMap', map);

    view.on('lookup', function(place) {
      that.trigger('lookup', place);
    });

    view.on('showDetails', function(place) {
      that.trigger('showDetails', place);
    });

    view.on('addPlaces', function(map) {
      that.showAddPlacesList(map);
    })
  },

  showAddPlacesList: function(map) {
    var places = this.places.getNotOnMap(map.attributes._id),
        that = this;

    var view = new AddPlacesToMapView ({ 
      model: map,
      places: places
    });

    view.once('done', function() {
      that.showMap(map);
    });

    this.$('.content').html(view.render().el);
    places.fetch();
  },

  hide: function() {
    this.$el.hide();    
  },

  show: function() {
    this.render();
    this.$el.show();    
  }
});

module.exports = MapsSidebarView;
},{"./addPlacesToMap.js":8,"./mapDetails.js":10,"./mapsList.js":12}],14:[function(require,module,exports){
var PlaceSidebarView = require('./placeSidebar.js'),
    MapsSidebarView = require('./mapsSidebar.js'),
    GMapView = require('./gmap.js'),
    PlaceMarkerView = require('./placeMarker.js'),
    Maps = require('../models/maps.js'),
    Places = require('../models/places.js'),
    Parse = require('../utils/parse.js');

var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "showMapsSidebar",
    "click #map-tab-nav": "hideMapsSidebar",
    "submit #new-place-tab form": "newPlace",
    "submit .search-form": "search"
  },

  initialize: function() {
    var that = this;
  
    this.worldMap = new GMapView();
    this.worldMap.on('addSearchResultClick', function(result) {
      that.setNewPlaceFields(result);
      that.openNewPlaceTab();
    });

    this.places = new Places();
    this.places.fetch();

    this.maps = new Maps();
    this.listenTo(this.maps, 'add', this.setupMap);
    this.maps.fetch();

    this.placeSidebar = new PlaceSidebarView({
      maps: this.maps
    });

    this.mapsSidebar = new MapsSidebarView({
      maps: this.maps,
      places: this.places
    });
    this.mapsSidebar.on('showMap', function(map) {
      that.resetMap(map);
      that.mapsSidebar.trigger('mapReady:' + map.attributes._id);
    });
    this.mapsSidebar.on('lookup', function(place) {
      that.worldMap.zoom(place);
    });
    this.mapsSidebar.on('showDetails', function(place) {
      that.placeSidebar.show(place);
    });
  },

  setupMap: function(map) {
    map.places = this.places.getMap(map.attributes._id);
    if (! this.currentMap) {
      this.openMap(map);
      this.currentMap.places.fetch();
    }
  },

  resetMap: function(map) {
    this.hideMap();
    this.openMap(map);  
  },

  openMap: function(map) {
    var that = this;
      // TODO: show current map name
    this.currentMap = map;
    this.currentMap.places.onEach(function(place) {
      that.addPlaceOnMap(place);
    }, this);
  },

  hideMap: function() {
    this.currentMap.places.stopOnEach(this);
    _.each(this.currentMap.places.models, function(place) {
      if (place.attributes.name) { //TODO: isn't there a better way?
        place.hide();
      }
    });
  },

  addPlaceOnMap: function(place) {
    var view = new PlaceMarkerView({model: place, worldMap: this.worldMap}),
        that = this;

    view.on("placeMarkerClick", function(place) {
      that.placeSidebar.show(place);
    });
  },

  showMapsSidebar: function() {
    this.mapsSidebar.show();
  },

  hideMapsSidebar: function() {
    this.mapsSidebar.hide();
  },

// separate view?
  newPlace: function(e) {
    e.preventDefault();

    this.places.create({
      name: this.$('#new-place-tab input[name="name"]').val(),
      location: Parse.location(this.$('#new-place-tab input[name="location"]').val()),
      notes: this.$('#new-place-tab textarea[name="notes"]').val(),
      pics: Parse.pics(this.$('#new-place-tab textarea[name="pics"]').val()),
      parentMaps: []
    });
  },

  search: function(e) {
    e.preventDefault();
    this.worldMap.search(this.$('.search-form input').val());
  },

  setNewPlaceFields: function(place) {
    // sep view?
    this.$('#new-place-tab input[name="name"]').val(place.name);
    this.$('#new-place-tab input[name="location"]').val(place.location.lat + ", " + place.location.lng);
  },

  openNewPlaceTab: function() {
    this.$('#map-tab').removeClass("active");
    this.$('#map-tab-nav').removeClass("active");
    this.$('#new-place-tab').addClass("active");
    this.$('#new-place-tab-nav').addClass("active");
  }
});

module.exports = PageView;

},{"../models/maps.js":3,"../models/places.js":6,"../utils/parse.js":7,"./gmap.js":9,"./mapsSidebar.js":13,"./placeMarker.js":19,"./placeSidebar.js":21}],15:[function(require,module,exports){
var MapsDropdownView = require('./mapsDropdown.js');

var MapView = Backbone.View.extend({
  events: {
    "click .remove" : "removeFromMap"
  },

  initialize: function(options) {
    this.template = _.template($('#parent-map-edit-template').html());
  },

  render: function() {
    var that = this;

    this.setElement(this.template(this.model.toJSON()));

    return this;
  },

  showRemoveButton: function() {
    this.$('.remove').show();
  },

  hideRemoveButton: function() {
    this.$('.remove').hide();
  },

  removeFromMap: function(e) {
    e.preventDefault();

    this.trigger('removed');
  },

  clear: function() {
    this.$el.remove();
  }
});

var ParentMapsEditView = Backbone.View.extend({

  events: {
    "mouseover": "showEditButton",
    "mouseout": "hideEditButton",

    "click .edit": "showEditControls",
    "click .done": "hideEditControls"
  },

  initialize: function(options) {
    this.maps = options.maps;
    this.allMaps = options.allMaps;

    this.template = _.template($('#parent-maps-edit-template').html());

    this.edit = false;
  },

  render: function() {
    var that = this;

    this.setElement(this.template(this.model.toJSON()));

    this.maps.onEach(function(map) {
      that.addMap(map);
    });

    this.renderMapsDropdown();

  	return this;
  },

  addMap: function(map) {

    var that = this;

    var view = new MapView({
      model: map
    });

    view.on('removed', function() {
      that.removePlaceFromMap(map);
    });

    this.on('showRemoveButton', function() {
      view.showRemoveButton();
    });

    this.on('hideRemoveButton', function() {
      view.hideRemoveButton();
    });

    // we rely on this to happen when place is removed from collection
    this.model.on('removedFromMap:' + map.attributes._id, function() {
      view.clear();
    });

    this.$('ul.parent-maps').append(view.render().el);
  },

  renderMapsDropdown: function() {
    var that = this;

    var allButParentMaps = this.allMaps.getAllButParentMaps(this.model);

    var mapsDropdownView = new MapsDropdownView({
      maps: allButParentMaps
    });

    mapsDropdownView.on('mapDropdownClicked', function(map) {
      that.addPlaceToMap(map);
      that.trigger('showRemoveButton');
    });

    this.$('.add-on-map').html(mapsDropdownView.render().el);

    allButParentMaps.fetch();
  },

  showEditButton: function() {
    if(!this.edit) {
      this.$('.edit').show();
    }
  },

  hideEditButton: function() {
    this.$('.edit').hide();
  },

  showEditControls: function() {
    this.edit = true;

    this.hideEditButton();
    this.trigger('showRemoveButton');
    this.$('.add-on-map').show();
    this.$('.done').show();
  },

  hideEditControls: function() {
    this.edit = false;

    this.trigger('hideRemoveButton');
    this.$('.add-on-map').hide();
    this.$('.done').hide();
  },

  addPlaceToMap: function(map) {
    this.model.addToMap(map.attributes._id);
  },

  removePlaceFromMap: function(map) {
    this.model.removeFromMap(map.attributes._id);
  }
});

module.exports = ParentMapsEditView;
},{"./mapsDropdown.js":11}],16:[function(require,module,exports){
var Pic = require('../models/pic.js');

var PicView = Backbone.View.extend({

  initialize: function(options) {
    this.template = _.template($('#pic-link-template').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

module.exports = PicView;
},{"../models/pic.js":4}],17:[function(require,module,exports){
var PicView = require('./pic.js'),
    Pic = require('../models/pic.js'),
    ParentMapsEditView = require('./parentMapsEdit.js'),
    PlaceLocationView = require('./placeLocation.js'),
    PlaceNotesView = require('./placeNotes.js');

var PlaceDetailsView = Backbone.View.extend({

  events: {
    "click .place-name button.edit": "editName",
    "mouseover .place-name": "showEditButton",
    "mouseout .place-name": "hideEditButton",
    "focusout input.name-edit": "saveName"
  },

  initialize: function(options) {
    var that = this;

    this.maps = options.maps;

    this.template = _.template($('#place-details-template').html());
    this.editTemplate = _.template($('#edit-place-name-template').html());
  },

  render: function() {

    var that = this;

    var templateData = this.model.toJSON();
    templateData.picsHtml = this.renderPics();

    this.$el.html(this.template(templateData));

    this.showLocation();

    this.showNotes();

    this.setupCarousel();

    this.showParentMaps();

    return this;
  },

  showLocation: function() {
    var location = new PlaceLocationView({model: this.model});
    this.$('.location').html(location.render().el);
  },

  showNotes: function() {
    var notes = new PlaceNotesView({model: this.model});
    this.$('.notes').html(notes.render().el);
  },

  showEditButton: function() {
    this.$('.place-name .edit').show();
  },

  hideEditButton: function() {
    this.$('.place-name .edit').hide();
  },

  editName: function() {
    console.log(this.editTemplate(this.model.toJSON()));
    this.$('.place-name').html(this.editTemplate(this.model.toJSON()));
    this.$('.place-name input').focus();
  },

  saveName: function() {
    this.model.set({
      name: this.$('input[name="name"]').val()
    });

    this.render();
  },

  showParentMaps: function() {

    var parentMaps = this.maps.getParentMaps(this.model);

    var parentMapsView = new ParentMapsEditView({
      maps: parentMaps,
      model: this.model,
      allMaps: this.maps
    });

    this.$('.parent-maps.property').html(parentMapsView.render().el);

    parentMaps.fetch();
  },

  renderPics: function() {
    var pics = this.model.attributes.pics,
        html = "";

    for (var i = 0 ; i < pics.length ; ++i) {
      var pic = new Pic({src: pics[i]})
      var picHtml = new PicView({model: pic}).render().$el.html();
      html += picHtml;
    }
    return html;
  },

  setupCarousel: function() {
    var carousel = this.$('.visible-pics').jcarousel();

    this.$('.pics-prev')
      .on('jcarouselcontrol:inactive', function() {
        $(this).addClass('inactive');
      })
      .on('jcarouselcontrol:active', function() {
        $(this).removeClass('inactive');
      })
      .jcarouselControl({
        target: '-=1',
        carousel: carousel
      });

    this.$('.pics-next')
      .on('jcarouselcontrol:inactive', function() {
        $(this).addClass('inactive');
      })
      .on('jcarouselcontrol:active', function() {
        $(this).removeClass('inactive');
      })
      .jcarouselControl({
        target: '+=1',
        carousel: carousel
      });
  }
});

module.exports = PlaceDetailsView;
},{"../models/pic.js":4,"./parentMapsEdit.js":15,"./pic.js":16,"./placeLocation.js":18,"./placeNotes.js":20}],18:[function(require,module,exports){
var Parse = require('../utils/parse.js');

var PlaceLocationView = Backbone.View.extend({

  events: {
    "click button.edit": "edit",
    "mouseover": "showEditButton",
    "mouseout": "hideEditButton",
    "focusout input": "save"
  },

  initialize: function() {
    var that = this;

    this.template = _.template($('#place-location-template').html());
    this.editTemplate = _.template($('#edit-place-location-template').html());

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {

    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  showEditButton: function() {
    this.$('.edit').show();
  },

  hideEditButton: function() {
    this.$('.edit').hide();
  },

  edit: function() {
    this.$el.html(this.editTemplate(this.model.toJSON()));
    this.$('input').focus();
  },

  save: function() {
    this.model.set({
      location: Parse.location(this.$('input[name="location"]').val()),
    });

    this.render();
  }

});

module.exports = PlaceLocationView;
},{"../utils/parse.js":7}],19:[function(require,module,exports){
var SearchResultMenu = require('./searchResultMenu.js');

// TODO: What will happen with this view after model is destroyed?
var PlaceMarkerView = Backbone.View.extend({

  marker: {
    setMap: function() {}
  },

  initialize: function(options) {
    var that = this;

    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.clear);

    this.model.on('hiden', function() {
      that.clear();
    })

    this.map = options.worldMap.map;
    this.events = options.worldMap.events;

    if(options.color) 
      this.color = options.color;
    else
      this.color = 'FE7569';

    this.render();

  },

  render: function() {
    this.clear();

    if (this.model.attributes.location) {
      this.show(); 
    }
  },

  show: function() {
    var location = this.model.attributes.location;

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat, location.lng),
      map: this.map,
      title: this.model.name,
      icon: this.getPin(this.color)
    });

    var that = this;
    google.maps.event.addListener(this.marker, 'click', function() {
      that.trigger("placeMarkerClick", that.model);
    });
  },

  clear: function() {
    this.marker.setMap(null);
  },

  getPin: function(color) {
    return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));  
  },

// TODO: doesn't belong here
  showInfo: function() {
      // TODO: create once and reuse?
      var menu = new google.maps.InfoWindow(),
          view = new SearchResultMenu({model: this.model});
      menu.setContent(view.render().el);
      menu.open(this.map, this.marker);
  }
});

module.exports = PlaceMarkerView;
},{"./searchResultMenu.js":22}],20:[function(require,module,exports){
var PlaceNotesView = Backbone.View.extend({

  events: {
    "click button.edit": "edit",
    "mouseover": "showEditButton",
    "mouseout": "hideEditButton",
    "focusout textarea": "save"
  },

  initialize: function() {
    var that = this;

    this.template = _.template($('#place-notes-template').html());
    this.editTemplate = _.template($('#edit-place-notes-template').html());

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {

    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  showEditButton: function() {
    this.$('.edit').show();
  },

  hideEditButton: function() {
    this.$('.edit').hide();
  },

  edit: function() {
    this.$el.html(this.editTemplate(this.model.toJSON()));
    this.$('textarea').focus();
  },

  save: function() {
    this.model.set({
      notes: this.$('textarea[name="notes"]').val()
    });

    this.render();
  }

});

module.exports = PlaceNotesView;
},{}],21:[function(require,module,exports){
var PlaceDetailsView = require('./placeDetails.js');

var PlaceSidebarView = Backbone.View.extend({

  el: '.place-details',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {
    this.hide();
    this.maps = options.maps;
  },

  show: function(place) {
    var view = new PlaceDetailsView({
          model: place,
          maps: this.maps
        }),
        that = this;

    this.$('.content').html(view.render().el);
    this.$el.show();
  },

  onPlaceChanged: function(place) {
    if ( ! place.isValid() ) {
      this.hide();
    }
  },

  hide: function() {
    this.$el.hide();    
  }
});

module.exports = PlaceSidebarView;
},{"./placeDetails.js":17}],22:[function(require,module,exports){
var SearchResultMenu = Backbone.View.extend({

  className: 'search-res-menu',

  events: {
    "click .add-place"   : "addPlace",
  },

  initialize: function() {
    this.template = _.template($('#search-result-menu').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  addPlace: function(e) {
    e.preventDefault();
    this.model.trigger('addPlaceClick');
  }
});

module.exports = SearchResultMenu;
},{}]},{},[1]);
