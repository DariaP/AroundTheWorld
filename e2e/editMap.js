var login = require('./login.js');

var editInputSelector = 'div[ui-view="mapsSidebarContent"] input',
    saveChangesSelector = 'div[ui-view="mapsSidebarContent"] form button',
    mapTitleSelector = 'h4>span',
    buttonsSelector = 'h4 button';

describe('map', function() {
  it('should edit map title', function() {
    login(browser.driver);

    element(by.linkText('My maps')).click();
    element(by.linkText('Chicago')).click();

    element(by.css(mapTitleSelector)).click();
    element(by.css(editInputSelector)).sendKeys("Chicago-edited");
    element(by.css(saveChangesSelector)).click();

    expect(element(by.css(mapTitleSelector)).getText()).toEqual("Chicago-edited");
  });

  it('should save edited title', function() {

    element(by.linkText('My maps')).click();
    element(by.linkText('Chicago-edited')).click();

    expect(element(by.css(mapTitleSelector)).getText()).toEqual("Chicago-edited");
  });

  it('should delete edited map', function() {

    element(by.linkText('My maps')).click();
    element(by.linkText('Chicago-edited')).click();

    var deleteButton = element.all(by.css(buttonsSelector)).get(0);
    deleteButton.click();

    element(by.linkText('My maps')).click();
    element.all(by.linkText('Chicago-edited')).then(function(items) {
        expect(items.length).toBe(0);
    });
  });

  it('should edit map title and delete edited map', function() {

    element(by.linkText('My maps')).click();
    element(by.linkText('USA')).click();

    element(by.css(mapTitleSelector)).click();
    element(by.css(editInputSelector)).sendKeys("USA-edited");
    element(by.css(saveChangesSelector)).click();

    expect(element(by.css(mapTitleSelector)).getText()).toEqual("USA-edited");

    var deleteButton = element.all(by.css(buttonsSelector)).get(0);
    deleteButton.click();

    element(by.linkText('My maps')).click();
    element.all(by.linkText('USA-edited')).then(function(items) {
        expect(items.length).toBe(0);
    });
  });

});

