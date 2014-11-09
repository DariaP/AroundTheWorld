
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Add place to map", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Chicago a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 1);
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Haiku-Stairs input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add places to map", 7, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Mountain-trails a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Skydeck input');
    this.click('.maps.sidebar #Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
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
    this.click('.maps.sidebar #USA a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Skydeck input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 1);
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Skydeck a', 'Skydeck');
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
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
    this.click('.maps.sidebar #Washington-D-C- a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Bean input');
    this.click('.maps.sidebar #Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 0);
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
    this.click('.maps.sidebar #Washington-D-C- a');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Bean input');
    this.click('.maps.sidebar #Bean input');
    this.click('.maps.sidebar #Bean input');
    this.click('.save');

    test.assertElementCount('.maps.sidebar li', 1);
    test.assertSelectorHasText('.maps.sidebar #Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});
