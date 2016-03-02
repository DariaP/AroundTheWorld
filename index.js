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

  var loginCallbacks = {};

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

  app.get('/auth/facebook/login/:url',  
    function(req, res) {
      loginCallbacks[req.sessionID] = req.params.url;
      res.redirect('/auth/facebook/login');
    }
  );

  app.get('/auth/facebook/login',
    facebook.login(),
    function(req, res) {}
  );

  app.get('/auth/facebook/callback/',
    facebook.onFailure(),
    function(req, res) {
      var callbackUrl = decodeURIComponent(loginCallbacks[req.sessionID]);
      res.redirect(callbackUrl);
    }
  );

  app.get('/places/', function (req, res) {
    if (req.isAuthenticated()) {
      dbApi.getPlaces(userId(req.user), callback(res));      
    } else {
      callback(res)([]);
    }
  });

  app.get('/places/:mapId', function (req, res) {
    if (req.isAuthenticated()) {
      dbApi.getPlacesOnMap(req.params.mapId, userId(req.user), callback(res));      
    } else {
      callback(res)([]);
    }
  });

  app.get('/place/:id', function (req, res) {

    if (req.isAuthenticated()) {
      dbApi.getPlace(req.params.id, userId(req.user), callback(res));
    } else {
      callback(res)([]);
    }
  });

  app.put('/place/:id', function (req, res) {

    if (req.isAuthenticated()) {
      dbApi.editPlace(req.params.id, userId(req.user), req.body, callback(res));
    } else {
      callback(res)([]);
    }
  });

  app.post('/places', function (req, res) {
    dbApi.addPlace(userId(req.user), req.body, callback(res));
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
      callback(res)([]);
    }
  });

  app.delete('/maps/:id', function (req, res) {

    if (req.isAuthenticated()) {
      dbApi.deleteMap(req.params.id, userId(req.user), callback(res));
    } else {
      callback(res)([]);
    }
  });

  app.post('/maps', function (req, res) {
    dbApi.addMap(userId(req.user), req.body, callback(res));
  });

  app.put('/maps/:id', function (req, res) {
    dbApi.updateMap(req.params.id, req.body, userId(req.user), callback(res));
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
