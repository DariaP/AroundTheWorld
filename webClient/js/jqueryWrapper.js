function jqueryWrapper() {
  function detailsSidebar() {
    return $('#place-details-sidebar');
  };
  function detailsSidebarPicsDiv() {
    return detailsSidebar().find("#links");
  };
  function newPlaceForm() {
    return $('#new-place-form');
  };
  return {
    searchForm : function() {
      return $('#navbar-search-form');
    },
    searchInput : function() {
      return $('#navbar-search-input');
    },
    mapsSidebar : function() {
      return $('#maps-sidebar');
    },
    mapsSidebarLinks : function() {
      return $('#maps-sidebar').find('a');
    },
    sidebar: function() {
      return $('#sidebar');
    },
    detailsSidebar : detailsSidebar,
    detailsSidebarPicsDiv : detailsSidebarPicsDiv,
    detailsSidebarPics : function() {
      return detailsSidebarPicsDiv().find("img");
    },
    addPlaceOnMapDropdownList : function() {
      return $("#add-place-to-map-dropdown-list");
    },
    addPlaceOnMapDropdownListLinks : function() {
      return $("#add-place-to-map-dropdown-list").find('a');
    },
    sidebarSep : function() {
      return $('#sidebar-sep');
    },
    newPlaceForm : newPlaceForm,
    newPlaceName : function() {
      return newPlaceForm().find("#new-place-name");
    },
    newPlaceLocation : function() {
      return newPlaceForm().find("#new-place-location");
    },
    newPlacePics : function() {
      return newPlaceForm().find("#new-place-pics");
    },
    newPlaceNotes : function() {
      return newPlaceForm().find("#new-place-notes");
    },
    placeName : function() {
      return $('#place-name');
    },
    placeNotes : function() {
      return $('#place-desc');
    },
    newPlaceTab : function() {
      return $('#new-place-tab');
    },
    newPlaceTabHead : function() {
      return $("li:has(a[href='#new-place-tab'])");
    },
    mapTab : function() {
      return $('#map-tab');
    },
    mapTabHead : function() {
      return $("li:has(a[href='#map-tab'])");
    },
    myMapsButton : function() {
      return $("button#navbar-my-maps-button");
    },
    mapsList : function() {
      return $("ul#maps-list");
    }
  }
}