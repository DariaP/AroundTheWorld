var Page = require('./aroundTheWorldPage.js');

describe('list of maps', function() {

  it('should show maps list', function() {

    var page = new Page();
    page.login();

    page.openMapsList();
    page.expectMapsNumberToBe(4);

    page.expectMapInList('Chicago');
    page.expectMapInList('USA');
    page.expectMapInList('Washington D.C.');
    page.expectMapInList('Mountain trails');

  });

  it('should add new map', function() {

    var page = new Page();

    page.openMapsList();
    page.expectMapsNumberToBe(4);

    page.addMap("Test"); 

    page.expectMapsNumberToBe(5);
    page.expectMapInList("Test");

  });

  it('should save new map', function() {
    var page = new Page();

    page.openMapsList();

    page.expectMapsNumberToBe(5);
    page.expectMapInList("Test");
  });
});
