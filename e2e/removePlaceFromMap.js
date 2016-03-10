var Page = require('./aroundTheWorldPage.js');

describe('remove place from map', function() {
  it('should remove place from map', function() {

    var page = new Page();
    page.login();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');

    page.removePlaceFromMap('Bean');
    page.expectPlaceNotInList('Bean');
  });

  it('should save results', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceNotInList('Bean');
    page.expectPlaceInList('Skydeck');
  });
});

