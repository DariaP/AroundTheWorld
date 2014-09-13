function jqueryWrapper() {
  function detailsSidebar() {
    return $('#details-sidebar');
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
      return newPlaceForm().find("#new-name");
    },
    newPlaceLocation : function() {
      return newPlaceForm().find("#new-location");
    },
    newPlacePics : function() {
      return newPlaceForm().find("#new-pics");
    },
    newPlaceNotes : function() {
      return newPlaceForm().find("#new-notes");
    },
    placeName : function() {
      return $('#place-name');
    },
    placeNotes : function() {
      return $('#place-desc');
    }
  }
}