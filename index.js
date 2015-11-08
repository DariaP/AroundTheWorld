var mongo = require('./mongo.js');

function start(dbApi) {

  var express = require('express'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      cookieParser = require("cookie-parser"),
      methodOverride = require('method-override'),
      session = require('express-session'),
      facebook = require('./facebook.js');

  var app = express();

  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));


  app.use(facebook.initialize());
  app.use(facebook.session());

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());

  app.set('port', (process.env.PORT || 8000));
  app.use('/', express.static(__dirname + '/public'));

  var callback = function(resp) {
    return function(result) {
      if(result.err) resp.status(500).send(result);
      else resp.send(result);
    };
  };

  app.get('/auth/facebook',
    facebook.login(),
    function(req, res){}
  );

  app.get('/auth/facebook/callback',
    facebook.onFailure(),
    function(req, res) {
      console.log(req.user);  
      res.redirect('/');
    }
  );

  app.get('/places', function (req, res) {
    console.log(req.user);
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

mongo.init(function(dbApi) {
  start(dbApi);
});
