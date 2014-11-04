
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Add place to map and remove it", 11, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago a');
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

  casper.then(function() {
    this.click('ul#places-list div#Haiku-Stairs .remove');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Add place to map and remove it - reload", 3, function(test) {

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

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add places to map and remove them", 12, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Mountain-trails a');
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

  casper.then(function() {
    this.click('ul#places-list div#Skydeck .remove');
    this.click('ul#places-list div#Bean .remove');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Add places to map and remove them one by one", 22, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Mountain-trails a');
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
    this.click('ul#places-list div#Skydeck .remove');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('.add');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
    test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
  });

  casper.then(function() {
    this.click('ul#places-list div#Bean input');
    this.click('.save');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('ul#places-list div#Bean .remove');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 1);
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
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

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Add places to map and remove them one by one - reload", 5, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Mountain-trails a');
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

  casper.run(function() {
    test.done();
  });
});
