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

casper.test.begin("View map details", 9, function(test) {
  login(test, function(that) {
    that.click('#my-maps-nav a');

    that.click('.maps.sidebar #Chicago a');

    that.click('.add');

    test.assertElementCount('.maps.sidebar li', 1);
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');

    that.click('.maps.sidebar #Haiku-Stairs input');
    that.click('.save');

    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Add places to map", 7, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Mountain-trails a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Skydeck input');
    this.click('.maps.sidebar #Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add places to map one by one", 12, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar #USA a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Skydeck input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 1);
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Check and uncheck place", 3, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Washington-D-C- a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Bean input');
    this.click('.maps.sidebar #Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 0);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Check, uncheck and check place", 4, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Washington-D-C- a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Bean input');
    this.click('.maps.sidebar #Bean input');
    this.click('.maps.sidebar #Bean input');
    this.click('.save');

    test.assertElementCount('.maps.sidebar li', 1);
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});
