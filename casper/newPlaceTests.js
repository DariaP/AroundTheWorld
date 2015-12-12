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

casper.test.begin("Add new place", 3, function(test) {

  login(test, function() {});

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add new place", 8, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#new-place-tab-nav');
    casper.fill(
      '#new-place-tab form',
      {
        'name': 'Center of the World',
        'location': '0, 0',
        'notes': 'center',
        'pics': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Clouds_over_the_Atlantic_Ocean.jpg'
      }, true);

    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.add');

    test.assertSelectorHasText('.maps.sidebar #Center-of-the-World a', 'Center of the World');

    this.click('.maps.sidebar #Center-of-the-World input');
    this.click('.save');

    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorHasText('.maps.sidebar #Center-of-the-World a', 'Center of the World');

    this.click('.maps.sidebar #Center-of-the-World a');

    test.assertVisible('.place-details');
    test.assertSelectorHasText('.place-details .place-name', 'Center of the World');
    test.assertSelectorHasText('.place-details .location', '0, 0');
    test.assertSelectorHasText('.place-details .notes', 'center');
    test.assertElementCount('.place-details .all-pics a', 1);
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Edit new place", 3, function(test) {

  casper.start(casper.cli.get("addr"), function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Center-of-the-World a');

    this.click('.place-details .place-name .edit');
    casper.fill('.place-details form', {'name': 'Not really the center' }, true);
 
    this.click('.place-details .notes .edit');
    casper.fill('.place-details form', {'notes': 'Somewhere close to the center' }, true);

    this.click('.place-details .location .edit');
    casper.fill('.place-details form', {'location': '1, 1' }, true);

    test.assertSelectorHasText('.place-details .place-name', 'Not really the center');
    test.assertSelectorHasText('.place-details .notes', 'Somewhere close to the center');
    test.assertSelectorHasText('.place-details .location', '1, 1');
  });

  casper.run(function() {
    test.done();
  });
});