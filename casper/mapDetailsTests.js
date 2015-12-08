var system = require('system');

casper.on("resource.error", function(resourceError){
});

casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

function login(test, callback) {
  casper.start("http://localhost:8000", function() {
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

casper.test.begin("View map details", 6, function(test) {

  login(test, function(that) {
    that.click('#my-maps-nav a');
    that.click('.maps.sidebar #Chicago a');
 
    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul #Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("View edited map details", 3, function(test) {

  casper.start("http://localhost:8000", function() {
    this.click('#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Chicago .edit');
  });

  casper.then(function() {
    casper.fill(
      '.maps.sidebar #Chicago form',
      {
        'name': 'Chicago-edited'
      });
    this.click('.maps.sidebar #Chicago form .save');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul #Chicago-edited a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul #Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Reload details several times", 30, function(test) {

  casper.start("http://localhost:8000", function() {
    this.click('li#my-maps-nav a');
  });

  for (var i = 0 ; i < 10 ; ++i) {
    casper.then(function() {
      this.click('.maps.sidebar ul div#Chicago-edited a');
    });

    casper.then(function() {
      test.assertElementCount('.maps.sidebar ul li', 2);
      test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
      test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
    });    
    casper.then(function() {
      this.click('li#my-maps-nav a');
    });
  }

  casper.run(function() {
    test.done();
  });
});
