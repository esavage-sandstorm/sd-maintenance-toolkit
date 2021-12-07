const express = require('express');
const bodyParser = require('body-parser');
const port = 4619;

const api = express();
api.use(bodyParser.urlencoded({ extended: true}));
api.use(bodyParser.json());

  const crownSshConfig = {
    hostAddr : '172.99.75.203',
    port: 22,
    username: 'crowndev',
    keyFile: '/Users/ariksavage/.ssh/id_rsa',
  }

const sdSSHModule = require('./modules/sdSSH.module.js');
const sdSSH = new sdSSHModule(crownSshConfig);

const sdNightmareModule = require('./modules/sdNightmare.module.js');
const sdNightmare = new sdNightmareModule();

const sdClientModule = require('./modules/sdClient.module.js');
const sdClient = new sdClientModule();

const drupal7Module = require('./modules/drupal7.module.js');
const drupal7 = new drupal7Module();

// just to test connection
api.get('/api/hello', (req, res) => {
  res.json('hello');
});

// get data via the front end
api.get('/api/nightmare-test', (req, res) => {
  const cb = function(data){
    res.json(data);
  }
  sdNightmare.test(cb);
});

// get data via SSH
api.get('/api/ssh-test', (req, res) => {
  const cb = function(data){
    res.json(data);
  }
  sdSSH.test(crownSshConfig, cb);
});

// Server Status

api.post('/api/server/memory', (req, res) => {
  const cb = function(data){
    res.json(data);
  }
  sdSSH.serverMemory(cb);
});

api.post('/api/server/disk', (req, res) => {
  const cb = function(data){
    res.json(data);
  }
  sdSSH.serverDiskSpace(cb);
});

api.post('/api/server/php-module', (req, res) => {
  const moduleName = req.body.module_name;
  const cb = function(data){
    res.json(data);
  }
  sdSSH.findPhpModule(moduleName, cb);
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
  sdSSH.phpVersion(currentV);
});

// Site Specific tests
api.post('/api/site/ssl-expiration', (req, res) => {
  const url = req.body.url;
  const cb = function(data){
    const exp = new Date(data.replace('notAfter=', ''));
    res.json(exp.toString());
  }
  sdSSH.checkSSLExpiration(url, cb);
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
  const data = {
    url: 'https://www.crowncork.com/contact-us/contact-form/?cid=13453',
    formId: 'webform-client-form-10711',
    fields: [
    {
      type: 'text',
      selector: '#edit-submitted-name',
      value: 'Eric Savage'
    },
    {
      type: 'text',
      selector: '#edit-submitted-email',
      value: 'esavage@sandstormdesign.com'
    },
    {
      type: 'click',
      selector: '#edit-submitted-are-you-a-current-crown-customer-2 + .radio',
    },
    {
      type: 'text',
      selector: '#edit-submitted-subject',
      value: 'Test for maintenance'
    },
    {
      type: 'text',
      selector: '#edit-submitted-message',
      value: 'This is a test as part of Sandstorm Design\'s website maintenance. Please reply to confirm receipt of this message.'
    },
    ],
    hasCaptcha: true,
    submitSelector: '.form-submit'
  };
  const cb = function(data){
    res.json(data);
  }

  sdNightmare.formSubmit(data, cb);
});

api.post('/api/site/drupal7-maintenance', (req, res) => {
  const url = req.body.url;
  const username = req.body.username;
  const password = req.body.password;
  const cb = function(data){
    res.json(data);
  }
  drupal7.maintenance(url, username, password, cb);
});

api.post('/api/site/page-speed', (req, res) => {
  const url = req.body.url;
  const cb = function(data){
    res.json(data);
  }
  sdNightmare.googlePageSpeed(url, cb);
});

api.post('/api/client/all', (req, res) => {
  const cb = function(data){
    res.json(data);
  }
  sdClient.getClients(cb);
});
api.post('/api/client/save', (req, res) => {
  const client = req.body.client;
  const cb = function(data){
    res.json(data);
  }
  sdClient.save(client, cb);
});

api.listen(port);
console.log(`API is listening at localhost:${port}`);
