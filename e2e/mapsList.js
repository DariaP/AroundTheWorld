var login = require('./login.js');

describe('Around the world main page', function() {
  it('should show maps list', function() {
    login(browser.driver);

    element(by.linkText('My maps')).click();

    var maps = element.all(by.repeater('map in maps'));
    expect(maps.count()).toEqual(4);

    var mapTitles = maps.map(function(map) {
      return map.getText();
    });
    mapTitles.then(function (titles) {
      expect(titles.indexOf('Chicago')).not.toEqual(-1);
      expect(titles.indexOf('Washington D.C.')).not.toEqual(-1);
      expect(titles.indexOf('USA')).not.toEqual(-1);
      expect(titles.indexOf('Mountain trails')).not.toEqual(-1);
    });
  });
});
