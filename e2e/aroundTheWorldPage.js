var login = require('./login.js');

var newMapButtonSelector = 'div[ui-view="mapsSidebarContent"] h4 button',
    newMapInputSelector = 'div[ui-view="mapsSidebarContent"] input',
    newMapFormSelector = 'div[ui-view="mapsSidebarContent"] form';

var editInputSelector = 'div[ui-view="mapsSidebarContent"] input',
    saveChangesSelector = 'div[ui-view="mapsSidebarContent"] form button',
    mapTitleSelector = 'h4>span',
    buttonsSelector = 'h4 button';

var editInputSelector = 'div[ui-view="mapsSidebarContent"] input',
    newMapInputSelector = 'div[ui-view="mapsSidebarContent"] input',
    addMapButtonSelector = 'div[ui-view="mapsSidebarContent"] h4 button';


var AroundTheWorldPage = function() {

  this.login = function() {
    login(browser.driver);
  };

  this.openMapsList = function() {
    element(by.linkText('My maps')).click();
  };

  this.openMap = function(mapName) {
    element(by.linkText(mapName)).click();
  };

  this.expectMapsNumberToBe = function(number) {
    var maps = element.all(by.repeater('map in maps'));
    expect(maps.count()).toEqual(number);
  };

  this.expectMapInList = function(mapName) {
    expect(element(by.linkText(mapName)).isPresent()).toBe(true);
  };

  this.expectMapNotInList = function(mapName) {
    expect(element(by.linkText(mapName)).isPresent()).toBe(false);
  };

  this.expectMapTitleToBe = function(title) {
    expect(element(by.css(mapTitleSelector)).getText()).toEqual(title);
  };

  this.expectPlacesNumberToBe = function(number) {
    var places = element.all(by.repeater('place in places'));
    expect(places.count()).toEqual(number);
  };

  this.expectPlaceInList = function(placeName) {
    expect(element(by.linkText(placeName)).isPresent()).toBe(true);
  };

  this.expectPlaceNotInList = function(placeName) {
    expect(element(by.linkText(placeName)).isPresent()).toBe(false);
  };

  this.deleteMap = function() {
    var deleteButton = element.all(by.css(buttonsSelector)).get(0);
    deleteButton.click();
  };

  this.editMapTitle = function(newTitle) {
    element(by.css(mapTitleSelector)).click();
    element(by.css(editInputSelector)).sendKeys(newTitle);
    element(by.css(saveChangesSelector)).click();
  }

  this.removePlaceFromMap = function(placeTitle) {
    var place = element(by.linkText(placeTitle));
    browser.actions()
      .mouseMove(place, {x: 1, y: 1})
      .perform();

    place.all(by.css('button')).get(0).click();
  }

  this.openAddPlacesToMapList = function() {
    var openListButton = element.all(by.css(buttonsSelector)).get(1);
    openListButton.click();
  };

  this.addPlace = function(placeName) {
    element(by.partialLinkText(placeName)).element(by.css('button')).click();
  };

  this.return = function() {
    element(by.css('.done')).click();
  };

  this.addMap = function(newMapName) {
    element(by.css(newMapButtonSelector)).click();
    element(by.css(newMapInputSelector)).sendKeys(newMapName);
    element(by.css(newMapFormSelector)).submit();
  }
};

module.exports = AroundTheWorldPage;
