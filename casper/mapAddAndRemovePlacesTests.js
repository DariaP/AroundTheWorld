
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

casper.test.begin("Add place to map and remove it", 14, function(test) {
  login(test, function(that) {
    that.click('li#my-maps-nav a');

    that.click('.maps.sidebar ul div#Chicago a');

    that.click('.add');

    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    that.click('.maps.sidebar ul div#Haiku-Stairs input');
    that.click('.save');

    test.assertElementCount('.maps.sidebar ul li', 3);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    that.click('.maps.sidebar ul div#Haiku-Stairs .remove');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');

    that.click('.add');

    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add place to map and remove it - reload", 3, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar ul div#Chicago a');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add places to map and remove them", 12, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar ul div#Mountain-trails a');

    this.click('.add');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');

    this.click('.maps.sidebar ul div#Skydeck input');
    this.click('.maps.sidebar ul div#Bean input');
    this.click('.save');

    test.assertElementCount('.maps.sidebar ul li', 3);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    this.click('.maps.sidebar ul div#Skydeck .remove');
    this.click('.maps.sidebar ul div#Bean .remove');

    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    this.click('.add');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add places to map and remove them one by one", 22, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar ul div#Mountain-trails a');

    this.click('.add');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');

    this.click('.maps.sidebar ul div#Skydeck input');
    this.click('.save');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');
    this.click('.maps.sidebar ul div#Skydeck .remove');

    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    this.click('.add');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');

    this.click('.maps.sidebar ul div#Bean input');
    this.click('.save');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    this.click('.maps.sidebar ul div#Bean .remove');

    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    this.click('.add');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');

    this.click('.maps.sidebar ul div#Skydeck input');
    this.click('.save');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Add places to map and remove them one by one - reload", 5, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');

    this.click('.maps.sidebar ul div#Mountain-trails a');

    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Haiku-Stairs a', 'Haiku Stairs');

    this.click('.add');

    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});
