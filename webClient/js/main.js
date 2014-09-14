function onLoad() {

  var jquery = jqueryWrapper(),
      places = [],
      map = initMap(
        document.getElementById("map-canvas")
      ),
      dataClient = initDataClient(
        'http://localhost:29999',
        function() {}
      );
  
  hideDetailsSidebar();
  setupSearchForm();
  setupNewPlaceForm();

  map.onPlaceClick(function(placeTitle) {
    var place = places[placeTitle];
    showDetails(place);    
  });

  map.setAutocomplete(document.getElementById('navbar-search-input'));

  // TODO: use angular?
  map.contextMenuContent(function(title) {
    return "<h5 align='center'>" + title + "</h5><button type='button' class='btn btn-default link-style-button' id='add-place-button'>" +
    "<span class='glyphicon glyphicon-plus'></span> Add place</button>";
  });
  
  dataClient.onPlaces(function(dbPlaces) {
    dbPlaces.forEach(function(place) {
      map.putPlaceMarker(place);
      places[place.name] = place;
    });
  });
  dataClient.requestAllPlaces();


  function setupSearchForm() {
    jquery.searchForm().submit(function(e) {
      e.preventDefault();
      map.search(jquery.searchInput().val());
    });
  }
  function setupNewPlaceForm() {
    var newPlacesForm = jquery.newPlaceForm();
    newPlacesForm.submit(function(e) {
      e.preventDefault();

      var latlng = jquery.newPlaceLocation().val().split(/[, ]+/),
          pics = jquery.newPlacePics().val().split(/[, \n]+/);
      dataClient.addPlace({
        name: jquery.newPlaceName().val(),
        location: {
          lat: latlng[0],
          lng: latlng[1]
        },
        data: {
          notes: jquery.newPlaceNotes().val(),
          pics: pics
        }
      });
    });
  }

  function showDetails(place) {
    showPics(place.data.pics);
    jquery.placeName().text(place.name);
    jquery.placeNotes().text(place.data.notes);
    jquery.detailsSidebar().show();
  }

  function showPics(pics) {
    var detailsSidebar = jquery.detailsSidebar(),
        picsHtml = "";
    pics.forEach(function(pic) {
      picsHtml += "<div class='pic-frame'><a href='" + pic + "\' title='" + pic + "' data-gallery>"
      picsHtml += "<img src='" + pic + "' alt='" + pic + "' >" 
      picsHtml += "</a></div>"
    });
    picsHtml += "<div class='pageHolder-footer'></div>"
    jquery.detailsSidebarPicsDiv().html(picsHtml);
    resizeAndCropPics();
  }
  function resizeAndCropPics() {
    jquery.detailsSidebarPics().
    each(function(){
      var img = $(this);
      if (img[0].width > img[0].height) {
        img.height(100);
      } else {
        img.width(100);
      }
    });
  }
};

function hideDetailsSidebar() {
  jqueryWrapper().detailsSidebar().hide();
};