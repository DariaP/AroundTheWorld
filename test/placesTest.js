var Places = require('../js/places.js');

var expect = chai.expect;

describe("getMap and getNotOnMap divide places correctly", function() {

  it("All places are either on map or not on map", function(done) {
    var places = new Places();

    places.on('ready', function() {
      var map1 = places.getMap(1),
          notmap1 = places.getNotOnMap(1);

      map1.fetch();
      notmap1.fetch();

      expect(places.models).to.have.members(
        map1.models.concat(notmap1.models));

      done();
    });
     
    

    places.fetch();
  });

});