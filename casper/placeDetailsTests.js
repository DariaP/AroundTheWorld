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

casper.test.begin("View place details", 5, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');
    this.click('.maps.sidebar #Skydeck a');

    test.assertVisible('.place-details');
    test.assertSelectorHasText('.place-details .place-name', 'Skydeck');
    test.assertSelectorHasText('.place-details .location', '41.879587, -87.636159');
    test.assertSelectorHasText('.place-details .parent-maps', 'Chicago');
    test.assertElementCount('.place-details .all-pics a', 1);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("View another place details", 6, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');

    test.assertVisible('.place-details');
    test.assertSelectorHasText('.place-details .place-name', 'Haiku Stairs');
    test.assertSelectorHasText('.place-details .notes', 'Steep trail!');
    test.assertSelectorHasText('.place-details .parent-maps', 'USA');
    test.assertSelectorHasText('.place-details .parent-maps', 'Mountain trails');
    test.assertElementCount('.place-details .all-pics a', 4);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit place details", 5, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');
    

    this.click('.place-details .place-name .edit');
    casper.fill('.place-details form', {'name': 'Haiku Stairs Trail' }, true);
 
    this.click('.place-details .notes .edit');
    casper.fill('.place-details form', {'notes': 'Very steep trail' }, true);

    this.click('.place-details .location .edit');
    casper.fill('.place-details form', {'location': '21.401, -157.822' }, true);

    this.click('.place-details');

    test.assertSelectorHasText('.place-details .place-name', 'Haiku Stairs Trail');
    test.assertSelectorHasText('.place-details .notes', 'Very steep trail');
    test.assertSelectorHasText('.place-details .location', '21.401, -157.822');
    test.assertSelectorHasText('.place-details .parent-maps', 'USA');
    test.assertSelectorHasText('.place-details .parent-maps', 'Mountain trails');
  });

  casper.run(function() {
    test.done();
  });
});