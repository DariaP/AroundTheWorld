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
  hideMapsSidebar();
  setupSearchForm();
  setupNewPlaceForm();
  setupMyMapsButton();

  map.onPlaceClick(function(placeTitle) {
    var place = places[placeTitle];
    showDetails(place);    
  });

  map.setAutocomplete(document.getElementById('navbar-search-input'));

  // TODO: use angular?
  map.contextMenuContent(function(place) {
    return "<h5 align='center'>" + place.name + "</h5>" + 
    "<div width='100%'>" +
    "<a target='_blank' class='bootstrap-style-link' href='https://www.google.com/maps/place/" + place.formatted_address + "'>View on gmaps</a>" +
    "</div>" +
    "<button type='button' class='btn btn-default link-style-button' id='add-place-button' onclick='addSearchResult(" + JSON.stringify(place) + ")'>" +
    "<span class='glyphicon glyphicon-plus'></span>" +
    " Add place" +
     "</button>";
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

  function setupMyMapsButton() {
    var showDetailsSidebar = function() {
      var jquery = jqueryWrapper();
      jquery.detailsSidebar().show();
      if (jquery.mapsSidebar().is(":visible")) {
        jquery.sidebarSep().show();
      }
    };
    jquery.myMapsButton().click(function(e) {
      dataClient.onMaps(function(dbMaps) {
        dbMaps.forEach(function(map) {
          console.log(map);
        });
      });
      dataClient.requestAllMaps();
      showMapsSidebar();
    });
  }

  function showDetails(place) {
    getPicsHtml(place.data.pics, function(html) {
      jquery.detailsSidebarPicsDiv().html(html);
      jquery.placeName().text(place.name);
      jquery.placeNotes().text(place.data.notes);
      showDetailsSidebar();
    });
  }
  function getPicsHtml(pics, callback) {
    picsHtmlHelper(pics, 0, "", callback);
  }
  // recoursive helper
  function picsHtmlHelper(pics, i, html, callback) {
    if (i == pics.length) {
      callback(html);
    } else {
      var loadedImage = new Image();
      
      loadedImage.src = pics[i];
      loadedImage.onload = function(e) {
        var style = "";
        if (this.width > this.height) {
          style = "height='100px'";
        } else {
          style = "width='100px'";
        }
        var picHtml = "<div class='pic-frame'><a href='" + this.src + "' title='" + this.src + "' data-gallery>"
        picHtml += "<img " + style + " src='" + this.src + "' alt='" + this.src + "' >" 
        picHtml += "</a></div>"
        picsHtmlHelper(pics, i + 1, html + picHtml, callback);
      };
    }
  }
  function resizePics() {
    jquery.detailsSidebarPics().
    each(function() {
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
  var jquery = jqueryWrapper();
  jquery.detailsSidebar().hide();
  jquery.sidebarSep().hide();
};

function hideMapsSidebar() {
  var jquery = jqueryWrapper();
  jquery.mapsSidebar().hide();
  jquery.sidebarSep().hide();
};

function showMapsSidebar() {
  var jquery = jqueryWrapper();
  jquery.mapsSidebar().show();
  if (jquery.detailsSidebar().is(":visible")) {
    jquery.sidebarSep().show();
  }
};

function addSearchResult(place) {
  var jquery = jqueryWrapper();
  console.log(place);
  jquery.newPlaceName().val(place.name);
  jquery.newPlaceLocation().val(place.geometry.location.B + ", " + place.geometry.location.k);
  jquery.newPlaceNotes().val(place.formatted_address);
  openNewPlaceTab();
};
function openNewPlaceTab() {
  var jquery = jqueryWrapper();
  jquery.mapTab().removeClass("active");
  jquery.mapTabHead().removeClass("active");
  jquery.newPlaceTab().addClass("active");
  jquery.newPlaceTabHead().addClass("active");
};
