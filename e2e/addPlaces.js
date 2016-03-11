var Page = require('./aroundTheWorldPage.js');

describe('add places', function() {
  it('should add one place', function() {

    var page = new Page();
    page.login();

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');

    page.openAddPlacesToMapList();

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

    page.addPlace('Haiku Stairs');

    page.return();

    page.expectPlacesNumberToBe(3);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');
    page.expectPlaceInList('Haiku Stairs');
  });

  it('should add several places', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

    page.openAddPlacesToMapList();

    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');

    page.addPlace('Bean');
    page.addPlace('Skydeck');

    page.return();
    
    page.expectPlacesNumberToBe(3);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');
    page.expectPlaceInList('Haiku Stairs');
  });

  it('should save results', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');

    page.expectPlacesNumberToBe(3);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');
    page.expectPlaceInList('Haiku Stairs');

    page.openMapsList();
    page.openMap('Chicago');

    page.expectPlacesNumberToBe(3);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');
    page.expectPlaceInList('Haiku Stairs');
  });

  it('should add places one by one', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('Mountain trails');

    page.expectPlacesNumberToBe(1);
    page.expectPlaceInList('Haiku Stairs');

    page.openAddPlacesToMapList();
    page.addPlace('Bean');

    page.return();
    page.expectPlacesNumberToBe(2);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Haiku Stairs');

    page.openAddPlacesToMapList();
    page.addPlace('Skydeck');

    page.return();
    page.expectPlacesNumberToBe(3);
    page.expectPlaceInList('Bean');
    page.expectPlaceInList('Skydeck');
    page.expectPlaceInList('Haiku Stairs');

  });

});