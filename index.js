var mongo = require('./mongo.js');

function start(dbApi) {

  var express = require('express'),
      cors = require('cors'),
      bodyParser = require('body-parser');

  var app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  app.set('port', (process.env.PORT || 8000));
  app.use('/', express.static(__dirname + '/public'));

  var callback = function(resp) {
    return function(result) {
      if(result.err) resp.status(500).send(result);
      else resp.send(result);
    };
  };

  app.get('/places', function (req, res) {
    dbApi.getAllPlaces(callback(res));      
  });

  app.post('/places', function (req, res) {
    dbApi.updatePlace(req.body, callback(res));
  });

  app.get('/maps', function (req, res) {
    dbApi.getAllMaps(callback(res));
  });

  app.put('/map', function (req, res) {
    dbApi.updateMap(req.body, callback(res));
  });

  app.post('/map', function (req, res) {
    dbApi.addMap(req.body, callback(res));
  });

  app.delete('/map', function (req, res) {
    dbApi.deleteMap(req.query.id, callback(res));
  });

  app.listen(app.get('port'));
}

var dbApi=null;
//mongo.init(function(dbApi) {
  start(dbApi);
//});
