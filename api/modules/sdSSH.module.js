'use strict';
var Client = require('ssh2').Client;

const sdSSHModule = function(){
  const mod = this;

  mod.command = (config, cmd, cb) => {
    console.log(config);
    var conn = new Client();
    conn.on('ready', function() {
      console.log('Client :: ready');
      conn.exec(cmd, function(err, stream) {
        if (err) throw err;
        stream.on('close', function(code, signal) {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
        }).on('data', function(data) {
          // console.log('STDOUT: ' + data);
          var str = String(data).trim();
          cb(str);
        }).stderr.on('data', function(data) {
          // console.log('STDERR: ' + data);
        });
      });
    }).connect({
      host: config.hostAddr,
      port: config.port,
      username: config.username,
      privateKey: require('fs').readFileSync(config.keyFile)
    });
  }

  mod.test = (config, cb) => {
    mod.command(config, 'uptime', cb);
  }
}

module.exports = sdSSHModule;
