var Places = require('../../js/places.js');

var expect = chai.expect;
chai.should();

describe("#getMap", function() {
  var places, map1, notmap1;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      map1 = places.getMap(1);
      notmap1 = places.getNotOnMap(1);

      map1.fetch();
      notmap1.fetch();

      done();
    });
     
    places.fetch();

  });

  it("returns all places not in result of getNotOnMap", function() {
      expect(places.models).to.have.members(
        map1.models.concat(notmap1.models));
  });

  it("returns only places on map", function() {
      map1.models.should.all.have.deep.property('attributes.parentMaps');
      for (var i = 0 ; i < map1.models.length; ++i) {
        expect(map1.models[i].attributes.parentMaps).to.include.members([1]);
      }
  });
});

describe("#getMap", function() {
  var places, map1, newOnMap;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      map1 = places.getMap(1);
      map1.fetch();

      var notmap1 = places.getNotOnMap(1);
      notmap1.fetch();
      newOnMap = notmap1.models[0];

      newOnMap.addToMap(1);

      done();
    });
     
    places.fetch();

  });

  it("adds maps that were added to map", function() {
    expect(map1.models).to.include.members([newOnMap]);
  });

  after(function() {
    newOnMap.removeFromMap(1);
  });

});


describe("#getMap", function() {
  var places, map1, newNotOnMap;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      map1 = places.getMap(1);
      map1.fetch();

      newNotOnMap = map1.models[0];

      newNotOnMap.removeFromMap(1);

      done();
    });
     
    places.fetch();

  });

  it("remove maps that were removed from map", function() {
    expect(map1.models).to.not.include.members([newNotOnMap]);
  });

  after(function() {
    newNotOnMap.addToMap(1);
  });

});

describe("#getNotOnMap", function() {
  var places, notmap1;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      notmap1 = places.getNotOnMap(1);

      notmap1.fetch();

      done();
    });
     
    places.fetch();

  });

  it("returns only places not on map", function() {
      notmap1.models.should.all.have.deep.property('attributes.parentMaps');
      for (var i = 0 ; i < notmap1.models.length; ++i) {
        expect(notmap1.models[i].attributes.parentMaps).to.not.include.members([1]);
      }
  });
});


describe("#getNotOnMap", function() {
  var places, notmap1, newOnMap;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      notmap1 = places.getNotOnMap(1);
      notmap1.fetch();
      newOnMap = notmap1.models[0];

      newOnMap.addToMap(1);

      done();
    });
     
    places.fetch();

  });

  it("removes maps that were added to map", function() {
    expect(notmap1.models).to.not.include.members([newOnMap]);
  });

  after(function() {
    newOnMap.removeFromMap(1);
  });

});


describe("#getNotOnMap", function() {
  var places, notmap1, newNotOnMap;

  before(function (done) {
    places = new Places();

    places.on('ready', function() {
      notmap1 = places.getNotOnMap(1);
      notmap1.fetch();

      var map1 = places.getMap(1);
      map1.fetch();
      newNotOnMap = map1.models[0];

      newNotOnMap.removeFromMap(1);

      done();
    });
     
    places.fetch();

  });

  it("adds maps that were removed from map", function() {
    expect(notmap1.models).to.include.members([newNotOnMap]);
  });

  after(function() {
    newNotOnMap.addToMap(1);
  });

});
