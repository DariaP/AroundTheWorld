
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

casper.test.begin("Login", 3, function(test) {

  login(test, function(that) {
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add place on map", 14, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');
    
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');


    this.click('.place-details .parent-maps .edit');

    test.assertElementCount('.add-to-map .dropdown-menu li', 4);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Chicago', 'Chicago');
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');

    this.click('.add-to-map .dropdown-menu #Chicago a');

    test.assertElementCount('.parent-maps .property-value ul li', 3);
    test.assertSelectorHasText('.parent-maps .property-value #Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');

    test.assertElementCount('.maps.sidebar li', 3);

    test.assertElementCount('.add-to-map .dropdown-menu li', 3);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');

    this.click('.place-details .done');

    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorHasText('.parent-maps div', 'Chicago');

    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Reload and delete place from map", 19, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');

    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorHasText('.parent-maps div', 'Chicago');

    this.click('.place-details .parent-maps .edit');

    test.assertElementCount('.parent-maps .property-value ul li', 3);

    test.assertSelectorHasText('.parent-maps .property-value ul #Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');

    test.assertElementCount('.add-to-map .dropdown-menu li', 3);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');

    this.click('li#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');

    this.click('.parent-maps #Chicago .remove');

    test.assertElementCount('.parent-maps .property-value ul li', 2);
    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');

    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorDoesntHaveText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');

    this.click('.place-details .done');

    test.assertSelectorHasText('.parent-maps .property-value ', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value ', 'Mountain trails');
    test.assertSelectorDoesntHaveText('.parent-maps .property-value', 'Chicago');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Reload, add place on map and delete from map - place details", 25, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');

    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');

    this.click('.place-details .parent-maps .edit');

    test.assertElementCount('.parent-maps .property-value ul li', 2);

    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');

    this.click('li#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');
    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorDoesntHaveText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');


    test.assertElementCount('.add-to-map .dropdown-menu li', 4);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Chicago', 'Chicago');
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');

    this.click('.add-to-map .dropdown-menu #Chicago a');

    test.assertElementCount('.parent-maps .property-value ul li', 3);
    test.assertSelectorHasText('.parent-maps .property-value #Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');

    test.assertElementCount('.maps.sidebar li', 3);

    this.click('.parent-maps #Chicago .remove');

    test.assertElementCount('.parent-maps .property-value ul li', 2);
    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');

    test.assertElementCount('.maps.sidebar li', 2);

    this.click('.parent-maps .done');

    test.assertElementCount('.parent-maps .property-value ul li', 2);
    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');
    test.assertSelectorDoesntHaveText('.parent-maps .property-value', 'Chicago');

    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorDoesntHaveText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Reload, add place on map and delete from map - maps sidebar", 9, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('li#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');

    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');

    this.click('li#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');
    this.click('.maps.sidebar .add');
    this.click('.maps.sidebar #Haiku-Stairs input');
    this.click('.maps.sidebar .save');

    test.assertElementCount('.parent-maps .property-value ul li', 3);
    test.assertSelectorHasText('.parent-maps .property-value #Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');

    this.click('.maps.sidebar ul div#Haiku-Stairs .remove');

    test.assertElementCount('.parent-maps .property-value ul li', 2);
    test.assertSelectorHasText('.parent-maps .property-value #USA', 'USA');
    test.assertSelectorHasText('.parent-maps .property-value #Mountain-trails', 'Mountain trails');
  });

  casper.run(function() {
    test.done();
  });
});
