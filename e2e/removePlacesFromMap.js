var Page = require('./aroundTheWorldPage.js');

describe('remove places from map', function() {
  it('should remove all places from map', function() {

    var page = new Page();
    page.login();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');

    page.removePlaceFromMap('Bean');
    page.removePlaceFromMap('Skydeck');

    page.expectPlacesNumberToBe(0);
  });

  it('should save results', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(0);
  });

  it('should remove the only place from map', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

    page.removePlaceFromMap('Haiku Stairs');

    page.expectPlacesNumberToBe(0);
  });

  it('should save results', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');

    page.expectPlacesNumberToBe(0);
  });

});

