
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Add place on map", 15, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#USA a');
    this.click('ul#places-list div#Haiku-Stairs a');
    this.click('.place-details .edit');
  });

  casper.then(function() {
    this.click('#edit-place-form .add-map');
  });

  casper.then(function() {
    test.assertElementCount('.add-to-map .dropdown-menu li', 4);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Chicago', 'Chicago');
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');
  });

  casper.then(function() {
    this.click('.add-to-map .dropdown-menu #Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('.parent-maps ul li', 3);
    test.assertSelectorHasText('.parent-maps ul div#Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps ul div#USA', 'USA');
    test.assertSelectorHasText('.parent-maps ul div#Mountain-trails', 'Mountain trails');
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#Chicago a');
    test.assertElementCount('ul#places-list li', 2);

    this.click('#edit-place-form .add-map');
  });

  casper.then(function() {
    test.assertElementCount('.add-to-map .dropdown-menu li', 3);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');
  });


  casper.then(function() {
    this.click('#edit-place-form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorHasText('.parent-maps div', 'Chicago');
  });

  casper.then(function() {
    test.assertElementCount('ul#places-list li', 3);
    test.assertSelectorHasText('ul#places-list div#Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Reload and delete place from map", 20, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#USA a');
    this.click('ul#places-list div#Haiku-Stairs a');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorHasText('.parent-maps div', 'Chicago');

    this.click('.place-details .edit');
  });

  casper.then(function() {

    test.assertElementCount('.parent-maps ul li', 3);

    test.assertSelectorHasText('.parent-maps ul div#Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps ul div#USA', 'USA');
    test.assertSelectorHasText('.parent-maps ul div#Mountain-trails', 'Mountain trails');

    this.click('#edit-place-form .add-map');
  });

  casper.then(function() {
    test.assertElementCount('.add-to-map .dropdown-menu li', 3);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#Chicago a');
    test.assertElementCount('ul#places-list li', 3);
    test.assertSelectorHasText('ul#places-list #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('.parent-maps ul div#Chicago .remove');
  });

  casper.then(function() {
    test.assertElementCount('.parent-maps ul li', 2);
    test.assertSelectorHasText('.parent-maps ul div#USA', 'USA');
    test.assertSelectorHasText('.parent-maps ul div#Mountain-trails', 'Mountain trails');

    test.assertElementCount('ul#places-list li', 3);
  });

  casper.then(function() {
    this.click('#edit-place-form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorDoesntHaveText('.parent-maps div', 'Chicago');

    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorDoesntHaveText('ul#places-list #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Reload, add place on map and delete from map", 24, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#USA a');
    this.click('ul#places-list div#Haiku-Stairs a');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');

    this.click('.place-details .edit');
  });

  casper.then(function() {

    test.assertElementCount('.parent-maps ul li', 2);

    test.assertSelectorHasText('.parent-maps ul div#USA', 'USA');
    test.assertSelectorHasText('.parent-maps ul div#Mountain-trails', 'Mountain trails');
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#Chicago a');
    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorDoesntHaveText('ul#places-list #Haiku-Stairs a', 'Haiku Stairs');

    this.click('#edit-place-form .add-map');
  });

  casper.then(function() {
    test.assertElementCount('.add-to-map .dropdown-menu li', 4);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Chicago', 'Chicago');
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');
  });

  casper.then(function() {
    this.click('.add-to-map .dropdown-menu #Chicago a');
  });

  casper.then(function() {
    test.assertElementCount('.parent-maps ul li', 3);
    test.assertSelectorHasText('.parent-maps ul div#Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps ul div#USA', 'USA');
    test.assertSelectorHasText('.parent-maps ul div#Mountain-trails', 'Mountain trails');

    test.assertElementCount('ul#places-list li', 2);
  });

  casper.then(function() {
    this.click('.parent-maps ul div#Chicago .remove');
  });

  casper.then(function() {
    test.assertElementCount('.parent-maps ul li', 2);
    test.assertSelectorHasText('.parent-maps ul div#USA', 'USA');
    test.assertSelectorHasText('.parent-maps ul div#Mountain-trails', 'Mountain trails');

    test.assertElementCount('ul#places-list li', 2);
  });

  casper.then(function() {
    this.click('#edit-place-form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorDoesntHaveText('.parent-maps div', 'Chicago');

    test.assertElementCount('ul#places-list li', 2);
    test.assertSelectorDoesntHaveText('ul#places-list #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});
