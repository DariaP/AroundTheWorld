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

casper.test.begin("Edit existing map", 14, function(test) {

  login(test, function(that) {
    that.click('#my-maps-nav a');

    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #Chicago a', 'Chicago');

    that.click('.maps.sidebar #Chicago .edit');

    test.assertExists('.maps.sidebar #Chicago form');
    test.assertField({
      type: 'css', 
      path: '.maps.sidebar #Chicago form [name="name"]'
    }, 'Chicago');

    casper.fill(
      '.maps.sidebar #Chicago form',
      {
        'name': 'Chicago-edited'
      });
    that.click('.maps.sidebar #Chicago form .save');

    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited a', 'Chicago-edited');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Edit existing map - reload", 6, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click( '#my-maps-nav a');

    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited a', 'Chicago-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("My maps sidebar - edit new map", 6, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');

    this.click('.maps.sidebar .new');

    test.assertExists('.maps.sidebar form.new-map');

    casper.fill(
      '.maps.sidebar form.new-map',
      {
        'name': 'NewMap1'
      });
    this.click('.maps.sidebar form.new-map .save');

    test.assertSelectorHasText('.maps.sidebar ul li:nth-child(5) a', 'NewMap1');

    this.click('.maps.sidebar #NewMap1 .edit');

    test.assertExists('.maps.sidebar #NewMap1 form');
    test.assertField({
      type: 'css', 
      path: '.maps.sidebar #NewMap1 form [name="name"]'
    }, 'NewMap1');

    casper.fill(
      '.maps.sidebar #NewMap1 form',
      {
        'name': 'NewMap1-edited'
      });
    this.click('.maps.sidebar #NewMap1 form .save');

    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit new map - reload", 7, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');

    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited a', 'Chicago-edited');
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit and delete 2 maps", 13, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');

    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited a', 'Chicago-edited');
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited a', 'NewMap1-edited');

    this.click('.maps.sidebar #Chicago-edited .edit');
    this.click('.maps.sidebar #NewMap1-edited .edit');

    test.assertExists('.maps.sidebar #Chicago-edited form');
    test.assertExists('.maps.sidebar #NewMap1-edited form');

    casper.fill(
      '.maps.sidebar #Chicago-edited form',
      {
        'name': 'Chicago-edited-2'
      });
    this.click('.maps.sidebar #Chicago-edited form .save');
    casper.fill(
      '.maps.sidebar #NewMap1-edited form',
      {
        'name': 'NewMap1-edited-2'
      });
    this.click('.maps.sidebar #NewMap1-edited form .save');

    test.assertSelectorHasText('.maps.sidebar #Chicago-edited-2 a', 'Chicago-edited-2');
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited-2 a', 'NewMap1-edited-2');

    this.click('.maps.sidebar #Chicago-edited-2 .delete');

    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertNotExists('.maps.sidebar #Chicago-edited-2');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Edit and delete 2 maps - reload", 6, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');

    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited-2 a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});