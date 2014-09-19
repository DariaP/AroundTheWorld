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
    resetPlaces(dbPlaces);
  });
  dataClient.requestAllPlaces();

  function resetPlaces(newPlaces) {
    map.cleanMapMarkers();
    places = [];
    newPlaces.forEach(function(place) {
      map.putPlaceMarker(place);
      places[place.name] = place;
    });
  };
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
    jquery.myMapsButton().click(function(e) {
      dataClient.onPlacesOnMap(function(dbPlacesForMap) {     
        resetPlaces(dbPlacesForMap.places);
      });
      dataClient.onMaps(function(dbMaps) {
        var mapsListHtml = "";
        dbMaps.forEach(function(map) {
          mapsListHtml += "<li><a href='#'' class='bootstrap-style-link' id='" + map.name + "'>" + map.name + "</a></li>";
        });
        jquery.mapsList().html(mapsListHtml);
        jquery.mapsSidebarLinks().each(function() {
          var link = $(this);
          link.bind('click', function(e) {
            e.preventDefault();
            dataClient.requestPlacesOnMap(link.attr('id'));
          });
        });
        showMapsSidebar();
      });
      dataClient.requestAllMaps();
    });
  }
  //function setupMapLink(map) {
  //  jquery.getMapLink()
  //};

  function showDetails(place) {
    getPicsHtml(place.data.pics, function(html) {
      jquery.detailsSidebarPicsDiv().html(html);
      jquery.placeName().text(place.name);
      jquery.placeNotes().text(place.data.notes);
      getMapsDropdownList(function(html) {
        jquery.addPlaceOnMapDropdownList().html(html)
        jquery.addPlaceOnMapDropdownListLinks().each(function() {
          var link = $(this);
          link.bind('click', function(e) {
            e.preventDefault();
            console.log("Add place " + place.name + " on map " + link.text());
            dataClient.addPlaceOnMap(place.name, link.text());
          });
        });
        showDetailsSidebar();        
      });
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
  function getMapsDropdownList(callback) {
    dataClient.onMaps(function(dbMaps) {
      var mapsDropdownListHtml = '<li role="presentation">' +
        '<a role="menuitem" tabindex="-1" href="#" id = "add-to-new-map">New map</a></li>' +
        '<li role="presentation" class="divider"></li>';
      dbMaps.forEach(function(map) {
        mapsDropdownListHtml += '<li role="presentation">' + 
          '<a role="menuitem" tabindex="-1" href="#">' + 
          map.name + '</a></li>';
      });
      callback(mapsDropdownListHtml);
    });
    dataClient.requestAllMaps();
  }
};

var showDetailsSidebar = function() {
  var jquery = jqueryWrapper();
  jquery.detailsSidebar().show();
  if (jquery.mapsSidebar().is(":visible")) {
    jquery.sidebarSep().show();
  }
  jquery.sidebar().show();
};

function hideDetailsSidebar() {
  var jquery = jqueryWrapper();
  jquery.detailsSidebar().hide();
  jquery.sidebarSep().hide();
  if (!jquery.mapsSidebar().is(":visible")) {
    jquery.sidebar().hide();
  }
};

function hideMapsSidebar() {
  var jquery = jqueryWrapper();
  jquery.mapsSidebar().hide();
  jquery.sidebarSep().hide();
  if (!jquery.detailsSidebar().is(":visible")) {
    jquery.sidebar().hide();
  }
};

function showMapsSidebar() {
  var jquery = jqueryWrapper();
  jquery.mapsSidebar().show();
  if (jquery.detailsSidebar().is(":visible")) {
    jquery.sidebarSep().show();
  }
  jquery.sidebar().show();
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
