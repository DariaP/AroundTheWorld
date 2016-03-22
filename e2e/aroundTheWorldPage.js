var login = require('./login.js');

var addMapButtonSelector = '#sidebar button.add-new',
    addMapInputSelector = '#sidebar #add-map input',
    addMapFormSelector = '#sidebar #add-map',
    mapTitleSelector = '#sidebar h4>span',
    deleteMapButtonSelector = '#sidebar .delete',
    addPlacesToMapButtonSelector = '#sidebar .add',
    editMapTitleInputSelector = '#sidebar form.edit-map-title input',
    saveMapTitleButtonSelector = '#sidebar form.edit-map-title button';

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
    var deleteButton = element(by.css(deleteMapButtonSelector));
    deleteButton.click();
  };

  this.editMapTitle = function(newTitle) {
    element(by.css(mapTitleSelector)).click();
    element(by.css(editMapTitleInputSelector)).sendKeys(newTitle);
    element(by.css(saveMapTitleButtonSelector)).click();
  }

  this.removePlaceFromMap = function(placeTitle) {
    var place = element(by.linkText(placeTitle));
    browser.actions()
      .mouseMove(place, {x: 1, y: 1})
      .perform();

    place.all(by.css('button')).get(0).click();
  }

  this.openAddPlacesToMapList = function() {
    var openListButton = element(by.css(addPlacesToMapButtonSelector));
    openListButton.click();
  };

  this.addPlace = function(placeName) {
    element(by.partialLinkText(placeName)).element(by.css('button')).click();
  };

  this.return = function() {
    element(by.css('.done')).click();
  };

  this.addMap = function(newMapName) {
    element(by.css(addMapButtonSelector)).click();
    element(by.css(addMapInputSelector)).sendKeys(newMapName);
    element(by.css(addMapFormSelector)).submit();
  }
};

module.exports = AroundTheWorldPage;
