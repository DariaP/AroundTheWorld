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

function onLoad() {
  $('#details-sidebar').hide();

  map = initMap();
  dataClient = getDataClient(
    'http://localhost:29999',
    function() {}
    );
  dataClient.onPlaces(function(places) {
    places.forEach(function(place) {
      map.putPlaceMarker(place);
      showDetails(place);
    });
  });
  dataClient.requestAllPlaces();
}

function showDetails(place) {
  showPics(place.data.pics)
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
