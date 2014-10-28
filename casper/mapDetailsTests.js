
casper.on('remote.message', function(message) {
  this.echo('remote message caught: ' + message);
});

casper.test.begin("View map details", 3, function(test) {

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


casper.test.begin("View edited map details", 3, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  casper.then(function() {
    this.click('ul#maps-list div#Chicago .edit');
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
    this.click('ul#maps-list div#Chicago-edited a');
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

casper.test.begin("Reload details several times", 10, function(test) {

  casper.start("file:///Users/daria/github/AroundTheWorld/index.html", function() {
    this.click('li#my-maps-nav a');
  });

  for (var i = 0 ; i < 10 ; ++i) {
    casper.then(function() {
      this.click('ul#maps-list div#Chicago-edited a');
    });

    casper.then(function() {
      test.assertElementCount('ul#places-list li', 2);
      test.assertSelectorHasText('ul#places-list div#Skydeck a', 'Skydeck');
      test.assertSelectorHasText('ul#places-list div#Bean a', 'Bean');
    });    
    casper.then(function() {
      this.click('li#my-maps-nav a');
    });
  }

  casper.run(function() {
    test.done();
  });
});
