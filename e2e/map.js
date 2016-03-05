describe('Around the world main page', function() {
  it('should login', function() {

    browser.driver.get('http://localhost:8000');
    browser.driver.findElement(by.css('.navbar-right a')).click();

    browser.driver.findElement(by.css('div#loginform input[name = "email"]')).sendKeys(browser.params.login);
    browser.driver.findElement(by.css('div#loginform input[name = "pass"]')).sendKeys(browser.params.password);

    browser.driver.findElement(by.css('button#loginbutton')).click();

    var uname = browser.driver.findElement(by.css('.navbar-right .navbar-text'))
    expect(uname.getText()).toEqual('Hello, Daria Protsenko');
  });
});