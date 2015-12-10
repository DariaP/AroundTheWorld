
var system = require('system');

casper.on("resource.error", function(resourceError){
});

casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

function login(test, callback) {
  casper.start(casper.cli.get("addr"), function() {
    test.assertTitle("Around the world", "title is the one expected");
    this.click('a[href="/auth/facebook"]');
    this.waitForText("Log into Facebook",
      function pass () {
        test.assertExists('div#loginform');
        this.sendKeys('div#loginform input[name = "email"]',  system.env.FACEBOOK_USERNAME);
        this.sendKeys('div#loginform input[name = "pass"]',  system.env.FACEBOOK_PASSWORD);
        test.assertExists('#login_button_inline input');
        this.click('#login_button_inline input');

        this.waitForText("Hello, Daria Protsenko",
          function pass () { 
            callback(this);
          },
          function fail () {
            test.fail("Did not load page");
          }
        );

      },
      function fail () {
        test.fail("Did not load facebook login page");
      }
    );
  });
}

casper.test.begin("Remove all places from map", 8, function(test) {
  login(test, function(that) {
    that.click('li#my-maps-nav a');

    that.click('.maps.sidebar ul div#Chicago a');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');

    that.click('.maps.sidebar ul div#Bean .remove');
    that.click('.maps.sidebar ul div#Skydeck .remove');

    test.assertElementCount('.maps.sidebar ul li', 0);

    that.click('li#my-maps-nav a');

    that.click('.maps.sidebar ul div#Chicago a');

    test.assertElementCount('.maps.sidebar ul li', 0);
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Remove all places from map - reload", 1, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar ul div#Chicago a');

    test.assertElementCount('.maps.sidebar ul li', 0);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Remove the only place from map", 4, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar ul div#USA a');

    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    this.click('.maps.sidebar ul div#Haiku-Stairs .remove');

    test.assertElementCount('.maps.sidebar ul li', 0);

    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar ul div#USA a');

    test.assertElementCount('.maps.sidebar ul li', 0);
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Remove the only place from map - reload", 1, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar ul div#USA a');

    test.assertElementCount('.maps.sidebar ul li', 0);
  });

  casper.run(function() {
    test.done();
  });
});