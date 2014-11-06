
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("View place details", 5, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#Chicago a');
    this.click('ul#places-list div#Skydeck a');
  });

  casper.then(function() {
    test.assertVisible('div#place-details-sidebar');
    test.assertSelectorHasText('div#place-details-sidebar #place-name', 'Skydeck');
    test.assertSelectorHasText('div#place-details-sidebar .location', '41.879587, -87.636159');
    test.assertSelectorHasText('div#place-details-sidebar #place-details-parent-maps', 'Chicago');
    test.assertElementCount('div#place-details-sidebar #links a', 1);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("View another place details", 6, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#USA a');
    this.click('ul#places-list div#Haiku-Stairs a');
  });

  casper.then(function() {
    test.assertVisible('div#place-details-sidebar');
    test.assertSelectorHasText('div#place-details-sidebar #place-name', 'Haiku Stairs');
    test.assertSelectorHasText('div#place-details-sidebar #place-pics', 'Steep trail!');
    test.assertSelectorHasText('div#place-details-sidebar #place-details-parent-maps', 'USA');
    test.assertSelectorHasText('div#place-details-sidebar #place-details-parent-maps', 'Mountain trails');
    test.assertElementCount('div#place-details-sidebar #links a', 4);
  });

  casper.run(function() {
    test.done();
  });
});


casper.test.begin("Edit place details", 1, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
    this.click('ul#maps-list div#USA a');
    this.click('ul#places-list div#Haiku-Stairs a');
    this.click('div#place-details-sidebar .edit');
  });

  casper.then(function() {
    casper.fill(
      '#edit-place-form',
      {
        'name': 'Haiku-Stairs',
        'location': '1, 1',
        'notes': 'Very steep trail!!',
        'pics': 'https://c2.staticflickr.com/6/5281/5298818285_985bcf0b40_z.jpg'
      });
    this.click('#edit-place-form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('div#place-details-sidebar #place-name', 'Haiku-Stairs');
  });

  casper.run(function() {
    test.done();
  });
});
