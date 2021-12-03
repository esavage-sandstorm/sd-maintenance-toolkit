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

const sdNightmareModule = require('./modules/sdNightmare.module.js');
const sdNightmare = new sdNightmareModule();
const sdSSHModule = require('./modules/sdSSH.module.js');
const sdSSH = new sdSSHModule(crownSshConfig);

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

api.post('/api/server/php-module', (req, res) => {
  const moduleName = req.body.module_name;
  const cb = function(data){
    res.json(data);
  }
  sdSSH.findPhpModule(moduleName, cb);
});

api.post('/api/server/ssl-expiration', (req, res) => {
  const url = req.body.url;
  const cb = function(data){
    const exp = new Date(data.replace('notAfter=', ''));
    res.json(exp.toString());
  }
  sdSSH.checkSSLExpiration(url, cb);
})


api.listen(port);
console.log(`API is listening at localhost:${port}`);
