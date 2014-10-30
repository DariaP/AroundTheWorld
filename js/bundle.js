(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    'click #save': 'save'
  },

  initialize: function(options) {
    this.template = _.template($('#add-places-template').html());
    this.listenTo(options.places, 'add', this.addPlace);
    this.newPlaces = {};
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
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

    this.$('#places-list').append(view.render().el);
  },

  save: function(e) {
    for(id in this.newPlaces) {
      if (this.newPlaces[id]) {
        this.newPlaces[id].addToMap(this.model.attributes._id);
        this.model.places.add(this.newPlaces[id]);
      }
    }
    this.trigger('done');
  }
});

module.exports = AddPlacesToMapView;
},{}],2:[function(require,module,exports){
var Place = require('./place.js').Place,
    PlaceMarkerView = require('./placeMarkerView.js');

var GMapView = Backbone.View.extend({

  mapOptions: {
    center: new google.maps.LatLng(0, 0),
    zoom: 3
  },

  initialize: function(options) {

    this.map = new google.maps.Map(
      document.getElementById("map-canvas"),
      this.mapOptions
      );

    this.placesSearchService = new google.maps.places.PlacesService(this.map);

    var autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("navbar-search-input"));
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
  }
});

module.exports = GMapView;
},{"./place.js":12,"./placeMarkerView.js":15}],3:[function(require,module,exports){
$(function () {
  var PageView = require('./pageView.js');
  new PageView();
});
},{"./pageView.js":9}],4:[function(require,module,exports){
var Place = require('./place.js').Place;

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

var PlacesNotOnMapList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.url = 'http://localhost:8089/places';//?nmap=' + options.mapId;
  },

  fetch: function(options) {
    return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
      if (res.responseJSON && res.responseJSON.err) {
        alert("Can't get places, please try later");
      }
    });
  }

});

var MapsList = Backbone.Collection.extend({
  model: Map,
  url: 'http://localhost:8089/maps',

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
  }
});

module.exports = {
  PlacesList: PlacesList,
  Map: Map,
  PlacesNotOnMapList: PlacesNotOnMapList,
  MapsList: MapsList
};
},{"./place.js":12}],5:[function(require,module,exports){
var PlaceView = Backbone.View.extend({
  events: {
    "click #remove" : "removeFromMap"
  },

  initialize: function(options) {
    this.mapid = options.mapid;
    this.template = _.template($('#place-template').html());
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  removeFromMap: function(e) {
    var that = this;

    e.preventDefault();

    this.model.removeFromMap(this.mapid);

    this.$el.remove();
    this.trigger('removed', this.model);
  }
});

var MapDetailsView = Backbone.View.extend({

  events: {
    "click #add" : "onAddClick"
  },

  initialize: function() {
    this.template = _.template($('#map-details-template').html());
  },
 
  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.model.places.onEach(function(place) {
      if (place.attributes.name) {
        that.addPlace(place);
      }
    });

    return this;
  },

  addPlace: function(place) {
    var that = this;

    var view = new PlaceView({
      model: place,
      mapid: this.model.attributes._id
    });

    view.on('removed', function(place) {
      that.model.places.remove(place);
    });

    this.$('#places-list').append(view.render().el);
  },

  onAddClick: function(e) {
    e.preventDefault();
    this.trigger('addPlaces', this.model);
  }
});

module.exports = MapDetailsView;
},{}],6:[function(require,module,exports){
var MapView = Backbone.View.extend({

  initialize: function() {
    this.template = _.template($('#dropdown-map-template').html()),
    this.listenTo(this.model, 'change', this.render);
  },
 
  render: function() {
    this.setElement(this.template(this.model.toJSON()));
    return this;
  },
});

var MapsDropdownView = Backbone.View.extend({
  //el: '#add-place-to-map-dropdown-list',

  initialize: function(options) {
    var that = this;

// TODO: why el field didn't work?
    this.$el = options.elem;

    _.each(options.maps.models, function(map) {
      that.addMap(map);
    });
    this.listenTo(options.maps, 'add', this.addMap);
  },

  addMap: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.$el.on('click', function(e) {
      e.preventDefault();
      that.trigger('mapDropdownClicked', map);
    });

    this.$el.append(view.el);
  },
});

module.exports = MapsDropdownView;
},{}],7:[function(require,module,exports){
var MapView = Backbone.View.extend({

  tagName:  "li",
  
  events: {
    "click #delete" : "onDeleteClick",
    "click #edit" : "onEditClick",
    "click a" : "onLinkClick",
    "click #save" : 'onSaveClick'
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
      name : this.$('#edit-map-name').val()
    });
    this.render();
    // TODO: why does this work? o_O
    this.trigger('refreshed');
  }
});

var NewMapView = Backbone.View.extend({
  events: {
    "click #save" : 'onSaveClick'
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
    this.trigger('newMap', this.$('#name').val());
    this.$el.remove();
  }
});

var MapsListView = Backbone.View.extend({

  events: {
    "click #new": "newMap"
  },

  initialize: function(options) {
    this.template = _.template($('#maps-list-template').html());

    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMapToList);
  },

  render: function() {
    _.each(
      this.maps.models, 
      function(map) { 
        this.addMapToList;
      }
    );

    this.$el.html(this.template());

    this.showMaps();

    return this;
  },

  showMaps: function() {
    for (var i = 0 ; i < this.maps.models.length ; ++i) {
      if (this.maps.models[i].attributes.name) {
        this.addMapToList(this.maps.models[i]);
      }
    }
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

    this.$('#maps-list').append(view.el);
  },

  newMap: function(e) {
    //TODO: add to maps list
    var that = this;

    e.preventDefault();

    if (!this.addingNew) {
      this.addingNew = true;

      var view = new NewMapView();
      this.$('#maps-list').before(view.render().el);

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
},{}],8:[function(require,module,exports){
var MapsList = require('./map.js').MapsList,
    PlacesNotOnMapList = require('./map.js').PlacesNotOnMapList,
    MapDetailsView = require('./mapDetails.js'),
    MapsListView = require('./mapsListView.js'),
    AddPlacesToMapView = require('./addPlacesToMap.js');

var MapsSidebarView = Backbone.View.extend({
  el: '#maps-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {  
    this.maps = options.maps;
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

    this.$('#content').html(view.render().el);
  },

  showMap: function(map) {

    var view = new MapDetailsView({ model: map }),
        that = this;

    this.$('#content').html(view.render().el);

    this.once('mapReady', function(m) {
      if (m.attributes._id == map.attributes._id) {
        map.places.fetch();
      }
    });

    this.trigger('showMap', map);

    view.on('addPlaces', function(map) {
      that.showAddPlacesList(map);
    })
  },

  showAddPlacesList: function(map) {
    var places = new PlacesNotOnMapList ({mapId: map.attributes.id}),
        that = this;

    var view = new AddPlacesToMapView ({ 
      model: map,
      places: places
    });

    view.once('done', function() {
      that.showMap(map);
    });

    this.$('#content').html(view.render().el);
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
},{"./addPlacesToMap.js":1,"./map.js":4,"./mapDetails.js":5,"./mapsListView.js":7}],9:[function(require,module,exports){
var PlaceSidebarView = require('./placeSidebarView.js'),
    MapsList = require('./map.js').MapsList,
    GMapView = require('./gmapView.js'),
    MapsSidebarView = require('./mapsSidebarView.js'),
    PlaceMarkerView = require('./placeMarkerView.js'),
    Place = require('./place.js'),
    Places = require('./places.js');

var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "showMapsSidebar",
    "submit #new-place-form": "newPlace",
    "submit #navbar-search-form": "search"
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

    this.maps = new MapsList();
    this.listenTo(this.maps, 'add', this.setupMap);
    this.maps.fetch();

    this.placeSidebar = new PlaceSidebarView({
      maps: this.maps
    });

    this.mapsSidebar = new MapsSidebarView({
      maps: this.maps
    });
    this.mapsSidebar.on('showMap', function(map) {
      that.resetMap(map);
      that.mapsSidebar.trigger('mapReady', map);
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

// separate view?
  newPlace: function(e) {
    e.preventDefault();

    this.currentMap.places.create({
      name: this.$('#new-place-name').val(),
      location: Place.parseLocation(this.$('#new-place-location').val()),
      notes: this.$('#new-place-notes').val(),
      pics: Place.parsePics(this.$('#new-place-pics').val()),
      parentMaps: [this.currentMap.attributes._id]
    });
  },

  search: function(e) {
    e.preventDefault();
    this.worldMap.search(this.$('#navbar-search-input').val());
  },

  setNewPlaceFields: function(place) {
    // sep view?
    this.$('#new-place-name').val(place.name);
    this.$('#new-place-location').val(place.location.lat + ", " + place.location.lng);
  },

  openNewPlaceTab: function() {
    this.$('#map-tab').removeClass("active");
    this.$('#map-tab-nav').removeClass("active");
    this.$('#new-place-tab').addClass("active");
    this.$('#new-place-tab-nav').addClass("active");
  }
});

module.exports = PageView;

},{"./gmapView.js":2,"./map.js":4,"./mapsSidebarView.js":8,"./place.js":12,"./placeMarkerView.js":15,"./placeSidebarView.js":16,"./places.js":17}],10:[function(require,module,exports){
var Map = require('./map.js').Map;

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
},{"./map.js":4}],11:[function(require,module,exports){
// add to place view?
var Pic = Backbone.Model.extend({
  src: ""
});

var PicView = Backbone.View.extend({

  initialize: function(options) {
    this.template = _.template($('#pic-link-template').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

module.exports = {
  Pic: Pic,
  PicView: PicView
};
},{}],12:[function(require,module,exports){
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
    this.trigger('hiden');
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
},{}],13:[function(require,module,exports){
var MapsDropdownView = require('./mapsDropdownView.js'),
    MapsList = require('./map.js').MapsList,
    PicView = require('./pic.js').PicView,
    Pic = require('./pic.js').Pic,
    ParentMaps = require('./parentMapsView.js').ParentMaps,
    ParentMapsView = require('./parentMapsView.js').ParentMapsView;

var PlaceDetailsView = Backbone.View.extend({

  events: {
    "click #edit": "editPlace"
  },

  initialize: function() {
    this.template = _.template($('#place-details-template').html());
  },

  render: function() {
    var that = this;

    var templateData = this.model.toJSON();
    templateData.picsHtml = this.renderPics();
    this.$el.html(this.template(templateData));

    var parentMapsList = new ParentMapsView({
      maps: new ParentMaps({ids: this.model.attributes.parentMaps}),
      elem: this.$('#place-details-parent-maps')
    }).render();

    return this;
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

  editPlace: function() {
    this.trigger('editClick');
  }
});

module.exports = PlaceDetailsView;
},{"./map.js":4,"./mapsDropdownView.js":6,"./parentMapsView.js":10,"./pic.js":11}],14:[function(require,module,exports){
var MapsDropdownView = require('./mapsDropdownView.js'),
    MapsList = require('./map.js').MapsList,
    PicView = require('./pic.js').PicView,
    Pic = require('./pic.js').Pic,
    ParentMaps = require('./parentMapsView.js').ParentMaps,
    ParentMapsView = require('./parentMapsView.js').ParentMapsView,
    Place = require('./place.js');

var PlaceEditView = Backbone.View.extend({

  events: {
    "submit #edit-place-form": "save"
  },

  initialize: function(options) {
    this.maps = options.maps;
    this.template = _.template($('#place-edit-template').html());
    this.changes = {
      parentMaps: []
    };
  },

  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.startRenderingAsync();

    return this;
  },

  startRenderingAsync: function() {
    this.renderParentMaps();
    this.renderMapsDropdown();
  },

  renderMapsDropdown: function() {
    var that = this;

    var mapsDropdown = new MapsDropdownView({
      maps: this.maps,
      elem: this.$('#add-place-to-map-dropdown-list')
    });

    mapsDropdown.on('mapDropdownClicked', function(map) {
      that.addPlaceToMap(map);
    });

    mapsDropdown.render();
  },

  renderParentMaps: function() {
    this.parentMapsList = new ParentMapsView({
      maps: new ParentMaps({ids: this.model.attributes.parentMaps}),
      elem: this.$('#place-details-parent-maps')
    });
    this.parentMapsList.render();
  },

  addPlaceToMap: function(map) {
    if (-1 == $.inArray(map.attributes._id, this.model.attributes.parentMaps) &&
        -1 == $.inArray(map.attributes._id, this.changes.parentMaps)) {
      this.changes.parentMaps.push(map.attributes._id);
      this.parentMapsList.addMap(map);
    }
  },

  save: function(e) {
    e.preventDefault();

    //TODO: better way?
    this.model.set({
      name: this.$('#edit-place-name').val(),
      location: Place.parseLocation(this.$('#edit-place-location').val()),
      notes: this.$('#edit-place-notes').val(),
      pics: Place.parsePics(this.$('#edit-place-pics').val()),
      parentMaps: this.model.attributes.parentMaps.concat(this.changes.parentMaps)
    });
  }
});

module.exports = PlaceEditView;
},{"./map.js":4,"./mapsDropdownView.js":6,"./parentMapsView.js":10,"./pic.js":11,"./place.js":12}],15:[function(require,module,exports){
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
},{"./searchResultMenu.js":18}],16:[function(require,module,exports){
var PlaceDetailsView = require('./placeDetailsView.js'),
    PlaceEditView = require('./placeEditView.js');

var PlaceSidebarView = Backbone.View.extend({

  el: '#place-details-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {
    this.hide();
    this.maps = options.maps;
  },

  show: function(place) {
    var view = new PlaceDetailsView({model: place}),
        that = this;

    this.listenTo(place, 'change', function() {
      that.onPlaceChanged(place);
    });

    view.on('editClick', function() {
      that.edit(place);
    });

    this.$('#content').html(view.render().el);
    this.$el.show();
  },
  
  edit: function(place) {
    var view = new PlaceEditView({
      model: place,
      maps: this.maps
    });

    this.$('#content').html(view.render().el);
    this.$el.show();
  },

// TODO: change location on map if needed
  onPlaceChanged: function(place) {
    if (place.isValid() ) {
      this.show(place);
    } else {
      this.hide();
    }
  },

  hide: function() {
    this.$el.hide();    
  }
});

module.exports = PlaceSidebarView;
},{"./placeDetailsView.js":13,"./placeEditView.js":14}],17:[function(require,module,exports){
var Place = require('./place.js').Place;

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
        var place = this.places.models[i];

        if ( place.isOnMap(this.mapid)) {
          this.addPlace(place);        
        } else {
          this.listenToAdd(place);
        }
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
},{"./place.js":12}],18:[function(require,module,exports){
var SearchResultMenu = Backbone.View.extend({

  id: 'search-res-menu',

  events: {
    "click #add-place-button"   : "addPlace",
  },

  initialize: function() {
    this.template = _.template($('#search-result-menu').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  addPlace: function(e) {
    this.model.trigger('addPlaceClick');
  }
});

module.exports = SearchResultMenu;
},{}]},{},[3]);
