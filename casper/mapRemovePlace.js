
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Remove place from map", 7, function(test) {

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
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Remove place from map - reload", 2, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
  });

  casper.run(function() {
    test.done();
  });
});