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
    detailsSidebar : detailsSidebar,
    detailsSidebarPicsDiv : detailsSidebarPicsDiv,
    detailsSidebarPics : function() {
      return detailsSidebarPicsDiv().find("img");
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
    }
  }
}