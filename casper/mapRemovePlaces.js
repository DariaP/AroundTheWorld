
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Remove all places from map", 5, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('ul#places-list div#Bean .remove');
    this.click('ul#places-list div#Skydeck .remove');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 0);
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 0);
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Remove all places from map - reload", 1, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 0);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Remove the only place from map", 4, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#USA a');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('ul#places-list div#Haiku-Stairs .remove');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 0);
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#USA a');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 0);
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Remove the only place from map - reload", 1, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#USA a');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 0);
  });

  casper.run(function() {
    test.done();
  });
});