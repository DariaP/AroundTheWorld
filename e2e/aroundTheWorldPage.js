var login = require('./login.js');

var newMapButtonSelector = 'div[ui-view="mapsSidebarContent"] h4 button',
    newMapInputSelector = 'div[ui-view="mapsSidebarContent"] input',
    newMapFormSelector = 'div[ui-view="mapsSidebarContent"] form';

var AroundTheWorldPage = function() {

  this.login = function() {
    login(browser.driver);
  };

  this.openMapsList = function() {
    element(by.linkText('My maps')).click();
  };

  this.expectMapsNumberToBe = function(number) {
    var maps = element.all(by.repeater('map in maps'));
    expect(maps.count()).toEqual(number);
  };

  this.expectMapInList = function(mapName) {
    expect(element(by.linkText(mapName)).isPresent()).toBe(true);
  };

  this.addMap = function(newMapName) {
    element(by.css(newMapButtonSelector)).click();
    element(by.css(newMapInputSelector)).sendKeys(newMapName);
    element(by.css(newMapFormSelector)).submit();
  }
};

module.exports = AroundTheWorldPage;
