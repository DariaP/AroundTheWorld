var parse = {
  name: function(name) { return name;},
  location: function(locationStr) {
    var latlng = locationStr.split(/[, ]+/);
    return {
      lat: latlng[0],
      lng: latlng[1]
    };
  },
  pics: function(picsStr) {
    if (picsStr.length == 0)
      return [];
    else
      return picsStr.split(/[, \n]+/);
  }
}

var toStr = {
  name: function(name) {return name;},
  location: function(location) {
    if (location.lat && location.lng) {
      return location.lat + ", " + location.lng;
    }

    if (location.lng) {
      return "lng: " + location.lng;
    }

    if (location.lat) {
      return "lat: " + location.lat;
    }

    return "";
  } 
}