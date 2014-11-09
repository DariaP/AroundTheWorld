
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Remove place from map", 9, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 2);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar ul div#Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Bean .remove');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 1);
    test.assertSelectorHasText('.maps.sidebar ul div#Skydeck a', 'Skydeck');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Skydeck .remove');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 0);
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 0);
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Remove place from map - reload", 1, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 0);
  });

  casper.run(function() {
    test.done();
  });
});