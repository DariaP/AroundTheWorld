var login = require('./login.js');

var editInputSelector = 'div[ui-view="mapsSidebarContent"] input',
    newMapInputSelector = 'div[ui-view="mapsSidebarContent"] input',
    saveChangesSelector = 'div[ui-view="mapsSidebarContent"] form button',
    addMapButtonSelector = 'div[ui-view="mapsSidebarContent"] h4 button',
    mapTitleSelector = 'h4>span',
    buttonsSelector = 'h4 button';

describe('map', function() {
  it('should add new map', function() {
    login(browser.driver);

    element(by.linkText('My maps')).click();
    element(by.css(addMapButtonSelector)).click();
    element(by.css(newMapInputSelector)).sendKeys("Test");
    element(by.css(saveChangesSelector)).click();

    expect(element(by.linkText('Test')).isPresent()).toBe(true);
  });

  it('should save new map', function() {
    element(by.linkText('My maps')).click();
    expect(element(by.linkText('Test')).isPresent()).toBe(true);
  });

  it('should edit new map title', function() {

    element(by.linkText('My maps')).click();
    element(by.linkText('Test')).click();

    element(by.css(mapTitleSelector)).click();
    element(by.css(editInputSelector)).sendKeys("Test-edited");
    element(by.css(saveChangesSelector)).click();

    expect(element(by.css(mapTitleSelector)).getText()).toEqual("Test-edited");
  });

  it('should add and edit new map', function() {

    element(by.linkText('My maps')).click();
    element(by.css(addMapButtonSelector)).click();
    element(by.css(newMapInputSelector)).sendKeys("Test2");
    element(by.css(saveChangesSelector)).click();

    expect(element(by.linkText('Test2')).isPresent()).toBe(true);
    element(by.linkText('Test2')).click();

    element(by.css(mapTitleSelector)).click();
    element(by.css(editInputSelector)).sendKeys("Test2-edited");
    element(by.css(saveChangesSelector)).click();

    expect(element(by.css(mapTitleSelector)).getText()).toEqual("Test2-edited");
  });

  it('should save all changes', function() {
    element(by.linkText('My maps')).click();
    expect(element(by.linkText('Test-edited')).isPresent()).toBe(true);
    expect(element(by.linkText('Test2-edited')).isPresent()).toBe(true);
  });

  it('should delete new edited map', function() {
    element(by.linkText('My maps')).click();

    element(by.linkText('Test-edited')).click();

    var deleteButton = element.all(by.css(buttonsSelector)).get(0);
    deleteButton.click();

    element(by.linkText('My maps')).click();

    expect(element(by.linkText('Test-edited')).isPresent()).toBe(false);
  });

  it('should add and delete new map', function() {

    element(by.linkText('My maps')).click();
    element(by.css(addMapButtonSelector)).click();
    element(by.css(newMapInputSelector)).sendKeys("Test");
    element(by.css(saveChangesSelector)).click();

    element(by.linkText('Test')).click();

    var deleteButton = element.all(by.css(buttonsSelector)).get(0);
    deleteButton.click();

    element(by.linkText('My maps')).click();

    expect(element(by.linkText('Test')).isPresent()).toBe(false);
  });

});

