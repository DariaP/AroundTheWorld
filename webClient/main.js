function getDataClient(url, connectionClosedCallback) {
  var serverUnavailable = function () {
    $('#places').text("Temporary unavailable");
    connectionClosedCallback();
  };

  if (typeof io === 'undefined') {
    serverUnavailable();
  }

  var socket = io.connect(url);

  socket.on('disconnect', function() {
    serverUnavailable();
  });

  return {
    requestAllPlaces : function(url) {
      socket.emit('getAllPlaces');
    },
    onPlaces : function(callback) {
      socket.on('allPlaces', callback);
    }
  };
};
function hideDetailsSidebar() {
  console.log("Hide");
  $('#details-sidebar').hide();  
};
function onLoad() {
  var places = new Array();

  hideDetailsSidebar();

  map = initMap();
  map.onPlaceClick(function(placeTitle) {
    var place = places[placeTitle];
    showDetails(place);    
  });
  dataClient = getDataClient(
    'http://localhost:29999',
    function() {}
    );
  dataClient.onPlaces(function(dbPlaces) {
    dbPlaces.forEach(function(place) {
      map.putPlaceMarker(place);
      places[place.name] = place;
    });
  });
  dataClient.requestAllPlaces();
}

function showDetails(place) {
  showPics(place.data.pics)
  $('#place-name').text(place.name)
  $('#place-desc').text(place.data.notes)
  $('#details-sidebar').show();
}
function showPics(pics) {
  var detailsSidebar = $('#details-sidebar'),
      picsHtml = ""
  pics.forEach(function(pic) {
    picsHtml += "<div class='pic-frame'><a href=\"" + pic + "\" title=\"" + pic + "\" data-gallery>"
    picsHtml += "<img src=\"" + pic + "\" alt=\"" + pic + "\" >" 
    picsHtml += "</a></div>"
  });
  picsHtml += "<div class='pageHolder-footer'></div>"
  detailsSidebar.find("#links").html(picsHtml)
  resizeAndCropPics()
}
function resizeAndCropPics() {
  $('#details-sidebar').find('#links').find("img").
  each(function(){
    var img = $(this)
    if (img[0].width > img[0].height) {
      img.height(100)
    } else {
      img.width(100)
    }
  });
}
