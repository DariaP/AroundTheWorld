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

    var marker = new PlaceMapView({
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

// TODO: What will happen with this view after model is destroyed?
var PlaceMapView = Backbone.View.extend({

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

  showInfo: function() {
      // TODO: create once and reuse?
      var menu = new google.maps.InfoWindow(),
          view = new SearchResultMenu({model: this.model});
      menu.setContent(view.render().el);
      menu.open(this.map, this.marker);
  }
});


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