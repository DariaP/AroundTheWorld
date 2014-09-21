var GMapView = Backbone.View.extend({

  el: $("map-canvas"),

  events: {
  },

  map: {},
  mapOptions: {
    center: new google.maps.LatLng(46.414, -118.101),
    zoom: 3
  },

  initialize: function() {
    this.map = new google.maps.Map(
      document.getElementById("map-canvas"),
      this.mapOptions
      );
  },
});

var PlaceMapView = Backbone.View.extend({

  marker: {
    setMap: function() {}
  },

  initialize: function(options) {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);

    console.log(options);
    console.log(options.map);
    this.map = options.map;
    this.render();
  },

  render: function() {
    this.clear();
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.model.location.lat, this.model.location.lng),
      map: this.map,
      title: this.model.name,
      icon: this.getPin("FE7569")
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
  }
});
