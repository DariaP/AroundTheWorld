
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Add place to map", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Chicago a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('ul#places-list div#Haiku-Stairs input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 3);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add places to map", 7, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Mountain-trails a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('ul#places-list div#Skydeck input');
    this.click('ul#places-list div#Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 3);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add places to map one by one", 12, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#USA a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('ul#places-list div#Skydeck input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('ul#places-list div#Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 3);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Check and uncheck place", 3, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Washington-D-C- a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 3);
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('ul#places-list div#Bean input');
    this.click('ul#places-list div#Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 0);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Check, uncheck and check place", 4, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar ul div#Washington-D-C- a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 3);
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('ul#places-list div#Bean input');
    this.click('ul#places-list div#Bean input');
    this.click('ul#places-list div#Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});
