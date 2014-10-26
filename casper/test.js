casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Page load", 2, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    test.assertTitle("Around the world", "title is the one expected");
    test.assertExists('.gm-style', 'gmap is loaded');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("My maps sidebar", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('div#maps-sidebar');
    test.assertElementCount('ul#maps-list li', 4);
    test.assertSelectorHasText('ul#maps-list li:nth-child(1) a', 'Washington D.C.');
    test.assertSelectorHasText('ul#maps-list li:nth-child(2) a', 'USA');
    test.assertSelectorHasText('ul#maps-list li:nth-child(3) a', 'Mountain trails');
    test.assertSelectorHasText('ul#maps-list li:nth-child(4) a', 'Chicago');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("My maps sidebar - add new map", 2, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('div#maps-sidebar #new');
  });

  casper.then(function() {
    test.assertExists('div#maps-sidebar #new-map-form');
  });

  casper.then(function() {
    casper.fill(
      'div#maps-sidebar #new-map-form',
      {
        'name': 'NewMap1'
      });
    this.click('div#maps-sidebar #new-map-form #save');
  });

  casper.then(function() {
    test.assertSelectorHasText('ul#maps-list li:nth-child(5) a', 'NewMap1');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("My maps sidebar - delete new map", 8, function(test) {

  casper.page.injectJs('/Users/daria/github/AroundTheWorld/js/lib/jquery-1.11.1.min.js');

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertElementCount('ul#maps-list li', 5);
    test.assertExists('ul#maps-list div#NewMap1');
    test.assertExists('ul#maps-list div#NewMap1 .delete');
  });

  casper.then(function() {
    this.click('ul#maps-list div#NewMap1 .delete');
  });

  casper.then(function() {
    test.assertElementCount('ul#maps-list li', 4);
    test.assertSelectorHasText('ul#maps-list li:nth-child(1) a', 'Washington D.C.');
    test.assertSelectorHasText('ul#maps-list li:nth-child(2) a', 'USA');
    test.assertSelectorHasText('ul#maps-list li:nth-child(3) a', 'Mountain trails');
    test.assertSelectorHasText('ul#maps-list li:nth-child(4) a', 'Chicago');
  });

  casper.run(function() {
    test.done();
  });
});
