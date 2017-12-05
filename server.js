// see https://medium.com/@ryanchenkie_40935/angular-cli-deployment-host-your-angular-2-app-on-heroku-3f266f13f352
// for more information

const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();

// force SSL

const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }

    next();
  };
};

// instruct app to use forceSSL middleware
// todo: enable this when SSL is enabled for the servers
// app.use(forceSSL());
app.use(compression());
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 8080);
