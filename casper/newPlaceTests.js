
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("Add new place", 8, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#new-place-tab-nav');
    casper.fill(
      '#new-place-tab form',
      {
        'name': 'Center of the World',
        'location': '0, 0',
        'notes': 'center',
        'pics': 'http://4hdwallpaper.com/wp-content/uploads/2014/10/cell-sea-wallpapers.jpg'
      }, true);

    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.add');

    test.assertSelectorHasText('.maps.sidebar #Center-of-the-World a', 'Center of the World');

    this.click('.maps.sidebar #Center-of-the-World input');
    this.click('.save');

    test.assertElementCount('.maps.sidebar li', 2);
    test.assertSelectorHasText('.maps.sidebar #Center-of-the-World a', 'Center of the World');

    this.click('.maps.sidebar #Center-of-the-World a');

    test.assertVisible('.place-details');
    test.assertSelectorHasText('.place-details .place-name', 'Center of the World');
    test.assertSelectorHasText('.place-details .location', '0, 0');
    test.assertSelectorHasText('.place-details .notes', 'center');
    test.assertElementCount('.place-details .pic-links a', 1);
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Edit new place", 5, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('#my-maps-nav a');
    this.click('.maps.sidebar #USA a');
    this.click('.maps.sidebar #Center-of-the-World a');
    this.click('.place-details .edit');
  });

  casper.then(function() {
    casper.fill(
      '.place-details form',
      {
        'name': 'Not really the center',
        'location': '1, 1',
        'notes': 'Somewhere close to the center',
        'pics': ''
      });
    this.click('.parent-maps #USA .remove');
    this.click('.place-details form .save');
  });

  casper.then(function() {
    test.assertSelectorHasText('.place-details .place-name', 'Not really the center');
    test.assertSelectorHasText('.place-details .location', '1, 1');
    test.assertSelectorHasText('.place-details .notes', 'Somewhere close to the center');
    test.assertSelectorDoesntHaveText('.place-details .parent-maps', 'USA');
    test.assertElementCount('.place-details .pic-links a', 0);
  });

  casper.run(function() {
    test.done();
  });
});