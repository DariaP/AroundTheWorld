var Page = require('./aroundTheWorldPage.js');

describe('add and remove places', function() {
  it('should add and remove one place', function() {

    var page = new Page();
    page.login();

    page.openMapsList();
    page.openMap('Chicago');
    page.openAddPlacesToMapList();
    page.addPlace('Haiku Stairs');
    page.return();
    page.removePlaceFromMap('Haiku Stairs');

    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');

  });

  it('should save result', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');

  });

  it('should add and remove several places', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');
    page.openAddPlacesToMapList();
    page.addPlace('Bean');
    page.addPlace('Skydeck');
    page.return();
    page.removePlaceFromMap('Bean');
    page.removePlaceFromMap('Skydeck');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

    page.openMapsList();
    page.openMap('USA');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

  });

  it('should save result', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');
  });

  it('should add and remove several places one by one', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');

    page.openAddPlacesToMapList();
    page.addPlace('Bean');
    page.return();
    page.removePlaceFromMap('Bean');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

    page.openAddPlacesToMapList();
    page.addPlace('Skydeck');
    page.return();
    page.removePlaceFromMap('Skydeck');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

    page.openAddPlacesToMapList();
    page.addPlace('Skydeck');
    page.return();
    page.removePlaceFromMap('Skydeck');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

    page.openMapsList();
    page.openMap('USA');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

  });

  it('should save result', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');
  });

});