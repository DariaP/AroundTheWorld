
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Edit existing map", 11, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('div#maps-sidebar');
    test.assertElementCount('ul#maps-list li', 4);
    test.assertSelectorHasText('ul#maps-list div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('ul#maps-list div#USA a', 'USA');
    test.assertSelectorHasText('ul#maps-list div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('ul#maps-list div#Chicago a', 'Chicago');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago .edit');
  });

  casper.then(function() {
    test.assertExists('div#maps-sidebar #edit-map-form');
    test.assertField('name', 'Chicago');
  });

  casper.then(function() {
    casper.fill(
      'div#maps-sidebar #edit-map-form',
      {
        'name': 'Chicago-edited'
      });
    this.click('div#maps-sidebar #edit-map-form #save');
  });

  casper.then(function() {
    test.assertVisible('div#maps-sidebar');
    test.assertElementCount('ul#maps-list li', 4);
    test.assertSelectorHasText('ul#maps-list div#Chicago-edited a', 'Chicago-edited');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Edit existing map - reload", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('div#maps-sidebar');
    test.assertElementCount('ul#maps-list li', 4);
    test.assertSelectorHasText('ul#maps-list div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('ul#maps-list div#USA a', 'USA');
    test.assertSelectorHasText('ul#maps-list div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('ul#maps-list div#Chicago-edited a', 'Chicago-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("My maps sidebar - edit new map", 6, function(test) {

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


  casper.then(function() {
    this.click('ul#maps-list div#NewMap1 .edit');
  });

  casper.then(function() {
    test.assertExists('div#maps-sidebar #edit-map-form');
    test.assertField('name', 'NewMap1');
  });

  casper.then(function() {
    casper.fill(
      'div#maps-sidebar #edit-map-form',
      {
        'name': 'NewMap1-edited'
      });
    this.click('div#maps-sidebar #edit-map-form #save');
  });

  casper.then(function() {
    test.assertElementCount('ul#maps-list li', 5);
    test.assertSelectorHasText('ul#maps-list div#NewMap1-edited a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit new map - reload", 7, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('div#maps-sidebar');
    test.assertElementCount('ul#maps-list li', 5);
    test.assertSelectorHasText('ul#maps-list div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('ul#maps-list div#USA a', 'USA');
    test.assertSelectorHasText('ul#maps-list div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('ul#maps-list div#Chicago-edited a', 'Chicago-edited');
    test.assertSelectorHasText('ul#maps-list div#NewMap1-edited a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit and delete 2 maps", 13, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('div#maps-sidebar');
    test.assertElementCount('ul#maps-list li', 5);
    test.assertSelectorHasText('ul#maps-list div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('ul#maps-list div#USA a', 'USA');
    test.assertSelectorHasText('ul#maps-list div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('ul#maps-list div#Chicago-edited a', 'Chicago-edited');
    test.assertSelectorHasText('ul#maps-list div#NewMap1-edited a', 'NewMap1-edited');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago-edited .edit');
    this.click('ul#maps-list div#NewMap1-edited .edit');
  });

  casper.then(function() {
    test.assertExists('div#maps-sidebar div#Chicago-edited #edit-map-form');
    test.assertExists('div#maps-sidebar div#NewMap1-edited #edit-map-form');
    //test.assertField('name', 'Chicago');
  });

  casper.then(function() {
    casper.fill(
      'div#maps-sidebar div#Chicago-edited .edit-map-form',
      {
        'name': 'Chicago-edited-2'
      });
    this.click('div#maps-sidebar div#Chicago-edited .edit-map-form .save');
    casper.fill(
      'div#maps-sidebar div#NewMap1-edited .edit-map-form',
      {
        'name': 'NewMap1-edited-2'
      });
    this.click('div#maps-sidebar div#NewMap1-edited .edit-map-form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('ul#maps-list div#Chicago-edited-2 a', 'Chicago-edited-2');
    test.assertSelectorHasText('ul#maps-list div#NewMap1-edited-2 a', 'NewMap1-edited-2');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago-edited-2 .delete');
  });

  casper.then(function() {
    test.assertElementCount('ul#maps-list li', 4);
    test.assertNotExists('ul#maps-list div#Chicago-edited-2');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Edit and delete 2 maps - reload", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    test.assertVisible('div#maps-sidebar');
    test.assertElementCount('ul#maps-list li', 4);
    test.assertSelectorHasText('ul#maps-list div#Washington-D-C- a', 'Washington D.C.');
    test.assertSelectorHasText('ul#maps-list div#USA a', 'USA');
    test.assertSelectorHasText('ul#maps-list div#Mountain-trails a', 'Mountain trails');
    test.assertSelectorHasText('ul#maps-list div#NewMap1-edited-2 a', 'NewMap1-edited');
  });

  casper.run(function() {
    test.done();
  });
});