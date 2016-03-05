var login = require('./login.js');

describe('Around the world main page', function() {
  it('should login', function() {
    login(browser.driver);
  });
});