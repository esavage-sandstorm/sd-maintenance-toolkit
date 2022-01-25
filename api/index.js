const express = require('express');
const bodyParser = require('body-parser');
const port = 4619;

const api = express();
api.use(bodyParser.urlencoded({ extended: true}));
api.use(bodyParser.json());

const sdSSHModule = require('./modules/sdSSH.module.js');

const sdSSH = (req) => {
  const config = {
    host: req.body.host,
    port: req.body.port ? req.body.port : 22,
    username: req.body.username,
    key_file: req.body.key_file
  }
  const sdSSH = new sdSSHModule(config);
  return sdSSH;
}

const sdNightmareModule = require('./modules/sdNightmare.module.js');
const sdNightmare = new sdNightmareModule();

const sdClientModule = require('./modules/sdClient.module.js');
const sdClient = new sdClientModule();

// just to test connection
api.get('/api/hello', (req, res) => {
  res.json('hello');
});

// get data via the front end
api.get('/api/nightmare-test', (req, res) => {
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  sdNightmare.test(cb);
});

// get data via SSH
api.get('/api/ssh-test', (req, res) => {
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  // sdSSH(req, res).test(crownSshConfig, cb);
});

// Server Status

api.post('/api/server/memory', (req, res) => {
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  sdSSH(req).serverMemory(cb);
});

api.post('/api/server/disk', (req, res) => {
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  sdSSH(req).serverDiskSpace(cb);
});

api.post('/api/server/php-module', (req, res) => {
  const moduleName = req.body.module_name;
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  sdSSH(req).findPhpModule(moduleName, cb);
});

api.post('/api/server/php-version', (req, res) => {
  const php = {
    current: null,
    latest: null
  }

  const latestV = (v) => {
    php.latest = v;
    res.json(php);
  }
  const currentV = (v) => {
    php.current = v;
    sdNightmare.getLatestPHPversion(v, latestV);
  }
  sdSSH(req).phpVersion(currentV);
});

// Site Specific tests
api.post('/api/site/ssl-expiration', (req, res) => {
  const url = req.body.url;
  const cb = function(data, err){
    if(data){
      const exp = new Date(data.replace('notAfter=', ''));
      res.json(exp.toString());
    } else if (err) {
      res.json(err);
    }
  }
  sdSSH(req).checkSSLExpiration(url, cb);
});

api.post('/api/site/google-analytics', (req, res) => {
  const url = req.body.url;

  const cb = function(data){
    if (data){
      res.json(data);
    } else {
      res.json("GA not found.");
    }
  }

  sdNightmare.testGoogleAnalyticsRunning(url, cb);
});

api.post('/api/site/test-form', (req, res) => {
  const formdata = req.body;
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }

  sdNightmare.testForm(formdata, cb);
});

api.post('/api/site/get-form', (req, res) => {
  const data = req.body;
  const cb = function(data, err){

    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  if (data.url){
    sdNightmare.getForm(data, cb);
  } else {
    res.json('`url` is required.')
  }
});

api.post('/api/site/page-speed', (req, res) => {
  const url = req.body.url;
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  sdNightmare.googlePageSpeed(url, cb);
});

// CMS tests
const cmsModule = (cms) => {
  const name = cms.name;
  const version = cms.version;
  let mod = null;
  const v = version.split('.')[0];
  if (name == 'Drupal') {
    if (v == '7') {
      const drupal7Module = require('./modules/drupal7.module.js');
      mod = new drupal7Module();
    } else {
      const drupal9Module = require('./modules/drupal9.module.js');
      mod = new drupal9Module();
    }
  }
  // other CMS
  return mod;
}

const cmsTest = (req, res, method) => {
  const url = req.body.url;
  const loginPage = req.body.loginPage;
  const username = req.body.username;
  const password = req.body.password;
  const cms = cmsModule(req.body.cms);
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  cms[method](url, loginPage, username, password, cb);
}

api.post('/api/cms/test-login', (req, res) => {
  cmsTest(req, res, 'testLogin');
});

api.post('/api/cms/status', (req, res) => {
  cmsTest(req, res, 'checkStatus');
});

api.post('/api/cms/updates', (req, res) => {
  cmsTest(req, res, 'checkUpdates');
});

api.post('/api/cms/errors', (req, res) => {
  cmsTest(req, res, 'checkErrors');
});

api.post('/api/cms/maintenance', (req, res) => {
  cmsTest(req, res, 'maintenance');
});

// Clients
api.post('/api/client/all', (req, res) => {
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  sdClient.getClients(cb);
});
api.post('/api/client/save', (req, res) => {
  const client = req.body.client;
  const cb = function(data, err){
    if(data){
      res.json(data);
    } else if (err) {
      res.json(err);
    }
  }
  sdClient.save(client, cb);
});

api.listen(port);
console.log(`API is listening at localhost:${port}`);
