var Page = require('./aroundTheWorldPage.js');

describe('new map', function() {
  it('should add new map', function() {

    var page = new Page();
    page.login();

    page.openMapsList();
    page.expectMapsNumberToBe(4);

    page.addMap("Test"); 

    page.expectMapsNumberToBe(5);
    page.expectMapInList("Test");

  });

  it('should edit map title', function() {
    var page = new Page();

    page.openMapsList();
    page.openMap('Test');

    page.editMapTitle("Test-edited");
    page.expectMapTitleToBe('Test-edited');

    page.openMapsList();
    page.expectMapInList('Test-edited');
  });

  it('should save edited title', function() {
    var page = new Page();

    page.openMapsList();
    page.openMap('Test-edited');
    page.expectMapTitleToBe('Test-edited');
  });

  it('should add and edit new map', function() {

    var page = new Page();

    page.openMapsList();
    page.addMap("Test2"); 

    page.expectMapInList("Test2");

    page.openMap('Test2');

    page.editMapTitle("Test2-edited");
    page.expectMapTitleToBe('Test2-edited');

    page.openMapsList();
    page.expectMapInList('Test2-edited');
  });

  it('should save all changes', function() {
    var page = new Page();

    page.openMapsList();
    page.expectMapInList("Test-edited");
    page.expectMapInList("Test2-edited");
  });

  it('should delete new edited map', function() {
    var page = new Page();

    page.openMapsList();
    page.expectMapsNumberToBe(6);

    page.openMap('Test-edited');
    page.deleteMap();

    page.openMapsList();
    page.expectMapNotInList('Test-edited');
  });

  it('should add and delete new map', function() {
    var page = new Page();

    page.openMapsList();
    page.expectMapsNumberToBe(5);

    page.addMap("Test3"); 
    page.openMap('Test3');
    page.deleteMap();

    page.openMapsList();
    page.expectMapNotInList('Test3');
  });

  it('should add, edit and delete new map', function() {
    var page = new Page();

    page.openMapsList();
    page.expectMapsNumberToBe(5);

    page.addMap("Test4"); 
    page.openMap('Test4');
    page.editMapTitle("Test4-edited");
    page.deleteMap();

    page.openMapsList();
    page.expectMapNotInList('Test4');
    page.expectMapNotInList('Test4-edited');
  });

});

