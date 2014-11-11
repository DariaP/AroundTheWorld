
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