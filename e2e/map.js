var Page = require('./aroundTheWorldPage.js');

describe('map', function() {
  it('should show map details', function() {

    var page = new Page();
    page.login();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectMapTitleToBe('Chicago');
    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');
  });

  it('should remove map', function() {

    var page = new Page();

    page.openMapsList();
    page.expectMapsNumberToBe(4);

    page.openMap('Chicago');
    page.deleteMap();

    page.openMapsList();
    page.expectMapsNumberToBe(3);
    page.expectMapNotInList('Chicago');
  });
});

