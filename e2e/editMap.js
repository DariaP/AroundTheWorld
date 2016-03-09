var Page = require('./aroundTheWorldPage.js');

describe('map', function() {
  it('should edit map title', function() {
    var page = new Page();
    page.login();

    page.openMapsList();
    page.openMap('Chicago');

    page.editMapTitle("Chicago-edited");
    page.expectMapTitleToBe('Chicago-edited');

    page.openMapsList();
    page.expectMapInList('Chicago-edited');
  });

  it('should save edited title', function() {
    var page = new Page();

    page.openMapsList();
    page.openMap('Chicago-edited');
    page.expectMapTitleToBe('Chicago-edited');
  });

  it('should delete edited map', function() {
    var page = new Page();

    page.openMapsList();
    page.expectMapsNumberToBe(4);

    page.openMap('Chicago-edited');
    page.deleteMap();

    page.expectMapsNumberToBe(3);
    page.expectMapNotInList('Chicago-edited');
  });

  it('should edit map title and delete edited map', function() {

    var page = new Page();

    page.openMapsList();
    page.openMap('USA');

    page.editMapTitle("USA-edited");
    page.expectMapTitleToBe('USA-edited');

    page.deleteMap();

    page.expectMapsNumberToBe(2);
    page.expectMapNotInList('USA-edited');
  });

});

