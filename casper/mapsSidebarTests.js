
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
    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar ul div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar ul div#USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar ul div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar ul div#Chicago a', 'Chicago');
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
    this.click('.maps.sidebar .new');
  });

  casper.then(function() {
    test.assertExists('.maps.sidebar form.new-map');
  });

  casper.then(function() {
    casper.fill(
      '.maps.sidebar form.new-map',
      {
        'name': 'NewMap1'
      });
    this.click('.maps.sidebar form.new-map .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.maps.sidebar ul li:nth-child(5) a', 'NewMap1');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("My maps sidebar - delete new map", 8, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertExists('.maps.sidebar ul div#NewMap1');
    test.assertExists('.maps.sidebar ul div#NewMap1 .delete');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#NewMap1 .delete');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar ul div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar ul div#USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar ul div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar ul div#Chicago a', 'Chicago');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("My maps sidebar - add and delete map", 10, function(test) {

  casper.page.injectJs('/Users/daria/github/AroundTheWorld/js/lib/jquery-1.11.1.min.js');

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    this.click('.maps.sidebar .new');
  });

  casper.then(function() {
    test.assertExists('.maps.sidebar form.new-map');
  });

  casper.then(function() {
    casper.fill(
      '.maps.sidebar form.new-map',
      {
        'name': 'NewMap2'
      });
    this.click('.maps.sidebar form.new-map .save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertExists('.maps.sidebar ul div#NewMap2');
  });

  casper.then(function() {
    test.assertExists('.maps.sidebar ul div#NewMap2 .delete');
    this.click('.maps.sidebar ul div#NewMap2 .delete');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar ul div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar ul div#USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar ul div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar ul div#Chicago a', 'Chicago');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("My maps sidebar - delete existing map", 5, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertExists('.maps.sidebar ul div#USA');
    test.assertExists('.maps.sidebar ul div#USA .delete');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#USA .delete');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 3);
    test.assertNotExists('.maps.sidebar ul div#USA');
  });

  casper.run(function() {
    test.done();
  });
});