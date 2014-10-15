(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./place.js":10,"./placeMarkerView.js":13}],2:[function(require,module,exports){
$(function () {
  var PageView = require('./pageView.js');
  new PageView();
});
},{"./pageView.js":7}],3:[function(require,module,exports){
var Place = require('./place.js').Place;

var PlacesList = Backbone.Collection.extend({
  model: Place,

  initialize: function(options) {
    this.url = 'http://localhost:8089/places?map=' + options.mapId;
  },

  fetch: function(options) {
    return Backbone.Collection.prototype.fetch.call(this, options).then(null, function(res) {
      if (res.responseJSON && res.responseJSON.err) {
        alert("Can't get places, please try later");
      }
    });
  }

});

var Map = Backbone.Model.extend({

  name: "",

  initialize: function(options) {
    this.places = new PlacesList({mapId: options._id});
  },

  clear: function() {
    _.invoke(this.places.models, 'clear');
    this.places.reset();
  },

});

var MapsList = Backbone.Collection.extend({
  model: Map,
  url: 'http://localhost:8089/maps'
});

module.exports = {
  PlacesList: PlacesList,
  Map: Map,
  MapsList: MapsList
};
},{"./place.js":10}],4:[function(require,module,exports){
var MapDetailsView = Backbone.View.extend({

  initialize: function() {
    this.template = _.template($('#map-details-template').html());
    this.placeTemplate = _.template($('#place-template').html());
    this.listenTo(this.model.places, 'add', this.addPlace);
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    //this.model.places.fetch();
    return this;
  },

  addPlace: function(place) {
  	//TODO: looks like the better way to do this kind of work
    this.$('#places-list').append(this.placeTemplate(place.toJSON()));
  }
});

module.exports = MapDetailsView;
},{}],5:[function(require,module,exports){
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
    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMap);

// TODO: why el field didn't work?
    this.$el = options.elem;
  },

  render: function() {
  	this.maps.fetch();
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
},{}],6:[function(require,module,exports){
var MapsList = require('./map.js').MapsList,
    MapDetailsView = require('./mapDetails.js');

var MapView = Backbone.View.extend({

  tagName:  "li",

  initialize: function() {
    this.template = _.template($('#map-template').html()),
    this.listenTo(this.model, 'change', this.render);
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

var MapsSidebarView = Backbone.View.extend({
  el: '#maps-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {
    this.mapsListTemplate = _.template($('#maps-list-template').html());
  	
    this.maps = new MapsList();
    this.listenTo(this.maps, 'add', this.addMapToList);

    this.hide();
  },

  render: function() {
    this.$('#content').html(this.mapsListTemplate());
    this.list = this.$('#maps-list');
  	this.list.html('');
  	this.maps.fetch();
  },

  addMapToList: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.$el.on('click', function(e) {
      e.preventDefault();
      //TODO: seq of code matters because of shared map/fetch staff
      that.showMap(map);
      that.trigger('mapMenuClicked', map);
    });

    this.list.append(view.el);
  },

  showMap: function(map) {
    var view = new MapDetailsView({ model: map });
    this.$('#content').html(view.render().el);
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
},{"./map.js":3,"./mapDetails.js":4}],7:[function(require,module,exports){
var PlaceSidebarView = require('./placeSidebarView.js'),
    MapsList = require('./map.js').MapsList,
    GMapView = require('./gmapView.js'),
    MapsSidebarView = require('./mapsSidebarView.js'),
    PlaceMarkerView = require('./placeMarkerView.js'),
    Place = require('./place.js');

var PageView = Backbone.View.extend({

  el: 'body',

  events: {
    "click #my-maps-nav": "showMapsSidebar",
    "submit #new-place-form": "newPlace",
    "submit #navbar-search-form": "search"
  },

  initialize: function() {
    var that = this;

    this.placeSidebar = new PlaceSidebarView();

    this.maps = new MapsList();
  
    this.worldMap = new GMapView();
    this.worldMap.on('addSearchResultClick', function(result) {
      that.setNewPlaceFields(result);
      that.openNewPlaceTab();
    });

    this.maps.fetch();
    this.listenTo(this.maps, 'add', this.openDefaultMap);

// Share maps list?
    this.mapsSidebar = new MapsSidebarView();
    var that = this;
    this.mapsSidebar.on('mapMenuClicked', function(map) {
      that.resetMap(map);
    });
  },

  openDefaultMap: function() {
    this.openMap(this.maps.at(0));
    this.stopListening(this.maps, 'add');
  },

  resetMap: function(map) {
    this.currentMap.clear();
    this.stopListening(this.currentMap.places, 'add');
    this.openMap(map);  
  },

  openMap: function(map) {
    this.currentMap = map;
    this.listenTo(this.currentMap.places, 'add', this.addPlaceOnMap);
    this.currentMap.places.fetch();
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

},{"./gmapView.js":1,"./map.js":3,"./mapsSidebarView.js":6,"./place.js":10,"./placeMarkerView.js":13,"./placeSidebarView.js":14}],8:[function(require,module,exports){
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
},{"./map.js":3}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
    return Backbone.sync(method, model, options).then(null, function(res) {
      if (res.responseJSON && res.responseJSON.err) {
        alert("Unable to add place " + this.name);
      }
    });
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
},{}],11:[function(require,module,exports){
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
},{"./map.js":3,"./mapsDropdownView.js":5,"./parentMapsView.js":8,"./pic.js":9}],12:[function(require,module,exports){
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

  initialize: function() {
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
      maps: new MapsList(),
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
},{"./map.js":3,"./mapsDropdownView.js":5,"./parentMapsView.js":8,"./pic.js":9,"./place.js":10}],13:[function(require,module,exports){
var SearchResultMenu = require('./searchResultMenu.js');

// TODO: What will happen with this view after model is destroyed?
var PlaceMarkerView = Backbone.View.extend({

  marker: {
    setMap: function() {}
  },

  initialize: function(options) {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.clear);

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
},{"./searchResultMenu.js":15}],14:[function(require,module,exports){
var PlaceDetailsView = require('./placeDetailsView.js'),
    PlaceEditView = require('./placeEditView.js');

var PlaceSidebarView = Backbone.View.extend({

  el: '#place-details-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function() {
    this.hide();
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
    var view = new PlaceEditView({model: place});

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
},{"./placeDetailsView.js":11,"./placeEditView.js":12}],15:[function(require,module,exports){
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
},{}]},{},[2]);
