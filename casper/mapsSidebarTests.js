var system = require('system');

casper.on("resource.error", function(resourceError){
//    console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
//    console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
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

casper.test.begin("My maps sidebar", 9, function(test) {

  login(test, function(that) {
    that.click('li#my-maps-nav a');

    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar ul div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar ul div#USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar ul div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar ul div#Chicago a', 'Chicago');

  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("My maps sidebar - add new map", 2, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar .new');

    test.assertExists('.maps.sidebar form.new-map');

    casper.fill(
      '.maps.sidebar form.new-map',
      {
        'name': 'NewMap1'
      });
    this.click('.maps.sidebar form.new-map .save');

    test.assertSelectorHasText('.maps.sidebar ul li:nth-child(5) a', 'NewMap1');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("My maps sidebar - delete new map", 8, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertExists('.maps.sidebar ul div#NewMap1');
    test.assertExists('.maps.sidebar ul div#NewMap1 .delete');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#NewMap1 .delete');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar ul div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar ul div#USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar ul div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar ul div#Chicago a', 'Chicago');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("My maps sidebar - add and delete map", 10, function(test) {

  //casper.page.injectJs('/Users/daria/github/AroundTheWorld/js/lib/jquery-1.11.1.min.js');

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    this.click('.maps.sidebar .new');
  });

  casper.then(function() {
    test.assertExists('.maps.sidebar form.new-map');
  });

  casper.then(function() {
    casper.fill(
      '.maps.sidebar form.new-map',
      {
        'name': 'NewMap2'
      });
    this.click('.maps.sidebar form.new-map .save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertExists('.maps.sidebar ul div#NewMap2');
  });

  casper.then(function() {
    test.assertExists('.maps.sidebar ul div#NewMap2 .delete');
    this.click('.maps.sidebar ul div#NewMap2 .delete');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar ul div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar ul div#USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar ul div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar ul div#Chicago a', 'Chicago');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("My maps sidebar - delete existing map", 5, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertExists('.maps.sidebar ul div#USA');
    test.assertExists('.maps.sidebar ul div#USA .delete');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#USA .delete');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 3);
    test.assertNotExists('.maps.sidebar ul div#USA');
  });

  casper.run(function() {
    test.done();
  });
});