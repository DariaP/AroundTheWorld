
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Add place on map", 15, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');
    this.click('.place-details .edit');
  });

  casper.then(function() {
    this.click('.place-details form .add-map');
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
    test.assertSelectorHasText('.parent-maps #Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps #USA', 'USA');
    test.assertSelectorHasText('.parent-maps #Mountain-trails', 'Mountain trails');
  });

  casper.then(function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');
    test.assertElementCount('.maps.sidebar li', 2);

    this.click('.place-details form .add-map');
  });

  casper.then(function() {
    test.assertElementCount('.add-to-map .dropdown-menu li', 3);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');
  });


  casper.then(function() {
    this.click('.place-details form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorHasText('.parent-maps div', 'Chicago');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Reload and delete place from map", 20, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorHasText('.parent-maps div', 'Chicago');

    this.click('.place-details .edit');
  });

  casper.then(function() {

    test.assertElementCount('.parent-maps ul li', 3);

    test.assertSelectorHasText('.parent-maps ul #Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps #USA', 'USA');
    test.assertSelectorHasText('.parent-maps #Mountain-trails', 'Mountain trails');

    this.click('.place-details form .add-map');
  });

  casper.then(function() {
    test.assertElementCount('.add-to-map .dropdown-menu li', 3);
    test.assertSelectorHasText('.add-to-map .dropdown-menu #Washington-D-C-', 'Washington D.C.');
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');
    test.assertElementCount('.maps.sidebar li', 3);
    test.assertSelectorHasText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.then(function() {
    this.click('.parent-maps #Chicago .remove');
  });

  casper.then(function() {
    test.assertElementCount('.parent-maps ul li', 2);
    test.assertSelectorHasText('.parent-maps #USA', 'USA');
    test.assertSelectorHasText('.parent-maps #Mountain-trails', 'Mountain trails');

    test.assertElementCount('.maps.sidebar li', 3);
  });

  casper.then(function() {
    this.click('.place-details form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorDoesntHaveText('.parent-maps div', 'Chicago');

    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorDoesntHaveText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Reload, add place on map and delete from map", 24, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');

    this.click('.place-details .edit');
  });

  casper.then(function() {

    test.assertElementCount('.parent-maps ul li', 2);

    test.assertSelectorHasText('.parent-maps #USA', 'USA');
    test.assertSelectorHasText('.parent-maps #Mountain-trails', 'Mountain trails');
  });

  casper.then(function() {
    this.click('li#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');
    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorDoesntHaveText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');

    this.click('.place-details form .add-map');
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
    test.assertSelectorHasText('.parent-maps #Chicago', 'Chicago');
    test.assertSelectorHasText('.parent-maps #USA', 'USA');
    test.assertSelectorHasText('.parent-maps #Mountain-trails', 'Mountain trails');

    test.assertElementCount('.maps.sidebar li', 2);
  });

  casper.then(function() {
    this.click('.parent-maps #Chicago .remove');
  });

  casper.then(function() {
    test.assertElementCount('.parent-maps ul li', 2);
    test.assertSelectorHasText('.parent-maps #USA', 'USA');
    test.assertSelectorHasText('.parent-maps #Mountain-trails', 'Mountain trails');

    test.assertElementCount('.maps.sidebar li', 2);
  });

  casper.then(function() {
    this.click('.place-details form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.parent-maps div', 'USA');
    test.assertSelectorHasText('.parent-maps div', 'Mountain trails');
    test.assertSelectorDoesntHaveText('.parent-maps div', 'Chicago');

    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorDoesntHaveText('.maps.sidebar #Haiku-Stairs a', 'Haiku Stairs');
  });

  casper.run(function() {
    test.done();
  });
});
