
function login(driver) {
  driver.get('http://localhost:8000');
  driver.findElement(by.css('.navbar-right a')).click();

  driver.findElement(by.css('div#loginform input[name = "email"]')).sendKeys(browser.params.login);
  driver.findElement(by.css('div#loginform input[name = "pass"]')).sendKeys(browser.params.password);

  driver.findElement(by.css('button#loginbutton')).click();

  var uname = browser.driver.findElement(by.css('.navbar-right .navbar-text'))
  expect(uname.getText()).toEqual('Hello, Daria Protsenko');
}

module.exports = login;