function start() {

  var express = require('express'),
      cors = require('cors'),
      bodyParser = require('body-parser');

  var app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  app.set('port', (process.env.PORT || 8000));
  app.use('/', express.static(__dirname + '/public'));




  app.listen(app.get('port'));
}

start();
