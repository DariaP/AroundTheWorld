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

  app.set('views', __dirname + '/public');
  app.use(express.static('public'));
  app.set('view engine', 'ejs');
  app.set('port', (process.env.PORT || 8000));


  app.use(methodOverride());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(session({ secret: 'keyboard cat' }));

  app.use(facebook.initialize());
  app.use(facebook.session());

  var callback = function(resp) {
    return function(result) {
      if(!result || result.err) resp.status(500).send(result);
      else resp.send(result);
    };
  };

  var userId = function(user) {
    return user.provider + "_" + user.id;
  }

  app.get('/', function(req, res){
    res.render('index', { user: req.user });
  });

  app.get('/auth/facebook',
    facebook.login(),
    function(req, res){}
  );

  app.get('/auth/facebook/callback',
    facebook.onFailure(),
    function(req, res) {
      res.redirect('/');
    }
  );

  app.get('/places/:mapId', function (req, res) {
    if (req.isAuthenticated()) {
      dbApi.getPlacesOnMap(req.params.mapId, userId(req.user), callback(res));      
    } else {
      callback(res)([]);
    }
  });

  app.post('/places', function (req, res) {
    dbApi.updatePlace(userId(req.user), req.body, callback(res));
  });

  app.get('/maps', function (req, res) {

    if (req.isAuthenticated()) {
      dbApi.getAllMaps(userId(req.user), callback(res));
    } else {
      callback(res)([]);
    }
  });

  app.get('/maps/:id', function (req, res) {

    if (req.isAuthenticated()) {
      dbApi.getMap(req.params.id, userId(req.user), callback(res));
    } else {
      console.log('empty')
      callback(res)([]);
    }
  });

  app.delete('/maps/:id', function (req, res) {

    if (req.isAuthenticated()) {
      dbApi.deleteMap(req.params.id, userId(req.user), callback(res));
    } else {
      console.log('empty')
      callback(res)([]);
    }
  });

  app.post('/maps', function (req, res) {
    dbApi.addMap(userId(req.user), req.body, callback(res));
  });

  app.put('/map', function (req, res) {
    dbApi.updateMap(req.body, callback(res));
  });

  app.post('/map', function (req, res) {
    dbApi.addMap(userId(req.user), req.body, callback(res));
  });

  app.delete('/map', function (req, res) {
    dbApi.deleteMap(req.query.id, callback(res));
  });

  app.listen(app.get('port'));
}

mongo.init(function(dbApi) {
  start(dbApi);
});
