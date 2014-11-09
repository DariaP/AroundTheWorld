
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("View place details", 5, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #Chicago a');
    this.click('.maps.sidebar #Skydeck a');
  });

  casper.then(function() {
    test.assertVisible('.place-details');
    test.assertSelectorHasText('.place-details .place-name', 'Skydeck');
    test.assertSelectorHasText('.place-details .location', '41.879587, -87.636159');
    test.assertSelectorHasText('.place-details .parent-maps', 'Chicago');
    test.assertElementCount('.place-details .pic-links a', 1);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("View another place details", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');
  });

  casper.then(function() {
    test.assertVisible('.place-details');
    test.assertSelectorHasText('.place-details .place-name', 'Haiku Stairs');
    test.assertSelectorHasText('.place-details .notes', 'Steep trail!');
    test.assertSelectorHasText('.place-details .parent-maps', 'USA');
    test.assertSelectorHasText('.place-details .parent-maps', 'Mountain trails');
    test.assertElementCount('.place-details .pic-links a', 4);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit place details", 5, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Haiku-Stairs a');
    this.click('.place-details .edit');
  });

  casper.then(function() {
    casper.fill(
      '.place-details form',
      {
        'name': 'Haiku-Stairs',
        'location': '1, 1',
        'notes': 'Very steep trail!!',
        'pics': 'https://c2.staticflickr.com/6/5281/5298818285_985bcf0b40_z.jpg'
      });
    this.click('.place-details form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.place-details .place-name', 'Haiku-Stairs');
    test.assertSelectorHasText('.place-details .notes', 'Very steep trail!!');
    test.assertSelectorHasText('.place-details .parent-maps', 'USA');
    test.assertSelectorHasText('.place-details .parent-maps', 'Mountain trails');
    test.assertElementCount('.place-details .pic-links a', 1);
  });

  casper.run(function() {
    test.done();
  });
});
