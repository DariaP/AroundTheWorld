
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Edit existing map", 11, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #Chicago a', 'Chicago');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Chicago .edit');
  });

  casper.then(function() {
    test.assertExists('.maps.sidebar #Chicago form');
    test.assertField('name', 'Chicago');
  });

  casper.then(function() {
    casper.fill(
      '.maps.sidebar #Chicago form',
      {
        'name': 'Chicago-edited'
      });
    this.click('.maps.sidebar #Chicago form .save');
  });

  casper.then(function() {
    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited a', 'Chicago-edited');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Edit existing map - reload", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click( '#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited a', 'Chicago-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("My maps sidebar - edit new map", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
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


  casper.then(function() {
    this.click('.maps.sidebar #NewMap1 .edit');
  });

  casper.then(function() {
    test.assertExists('.maps.sidebar #NewMap1 form');
    test.assertField('name', 'NewMap1');
  });

  casper.then(function() {
    casper.fill(
      '.maps.sidebar #NewMap1 form',
      {
        'name': 'NewMap1-edited'
      });
    this.click('.maps.sidebar #NewMap1 form .save');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit new map - reload", 7, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited a', 'Chicago-edited');
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit and delete 2 maps", 13, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 5);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited a', 'Chicago-edited');
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited a', 'NewMap1-edited');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Chicago-edited .edit');
    this.click('.maps.sidebar #NewMap1-edited .edit');
  });

  casper.then(function() {
    test.assertExists('.maps.sidebar #Chicago-edited form');
    test.assertExists('.maps.sidebar #NewMap1-edited form');
  });

  casper.then(function() {
    casper.fill(
      '.maps.sidebar #Chicago-edited form',
      {
        'name': 'Chicago-edited-2'
      });
    this.click('.maps.sidebar #Chicago-edited form .save');
    casper.fill(
      '.maps.sidebar #NewMap1-edited form',
      {
        'name': 'NewMap1-edited-2'
      });
    this.click('.maps.sidebar #NewMap1-edited form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.maps.sidebar #Chicago-edited-2 a', 'Chicago-edited-2');
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited-2 a', 'NewMap1-edited-2');
  });

  casper.then(function() {
    this.click('.maps.sidebar #Chicago-edited-2 .delete');
  });

  casper.then(function() {
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertNotExists('.maps.sidebar #Chicago-edited-2');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Edit and delete 2 maps - reload", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('.maps.sidebar');
    test.assertElementCount('.maps.sidebar ul li', 4);
    test.assertSelectorHasText('.maps.sidebar #Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('.maps.sidebar #USA a', 'USA');
    test.assertSelectorHasText('.maps.sidebar #Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('.maps.sidebar #NewMap1-edited-2 a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});