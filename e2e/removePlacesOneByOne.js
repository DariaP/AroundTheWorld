var Page = require('./aroundTheWorldPage.js');

describe('remove places from map one by one', function() {
  it('should remove all places from map', function() {

    var page = new Page();
    page.login();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');

    page.removePlaceFromMap('Bean');

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(1);

    page.removePlaceFromMap('Skydeck');

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(0);
  });

  it('should save results', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(0);
  });

});

