var login = require('./login.js');

var mapTitleSelector = 'h4 span',
    buttonsSelector = 'h4 button';

describe('map', function() {
  it('should show map details', function() {
    login(browser.driver);

    element(by.linkText('My maps')).click();
    element(by.linkText('Chicago')).click();

    expect(element(by.css(mapTitleSelector)).getText()).toEqual("Chicago");

    var places = element.all(by.repeater('place in places'));
    expect(places.count()).toEqual(2);

    var placesTitles = places.map(function(place) {
      return place.getText();
    });
    placesTitles.then(function (titles) {
      expect(titles.indexOf('Bean')).not.toEqual(-1);
      expect(titles.indexOf('Skydeck')).not.toEqual(-1);
    });
  });

  it('should remove map', function() {

    element(by.linkText('My maps')).click();

    var maps = element.all(by.repeater('map in maps'));
    expect(maps.count()).toEqual(4);

    element(by.linkText('Chicago')).click();

    var deleteButton = element.all(by.css(buttonsSelector)).get(0);
    deleteButton.click();

    element(by.linkText('My maps')).click();

    var maps = element.all(by.repeater('map in maps'));
    expect(maps.count()).toEqual(3);
    var mapTitles = maps.map(function(map) {
      return map.getText();
    });
    mapTitles.then(function (titles) {
      expect(titles.indexOf('Chicago')).toEqual(-1);
    });
  });

});

