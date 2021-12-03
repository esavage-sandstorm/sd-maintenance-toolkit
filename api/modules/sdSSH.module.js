'use strict';
var Client = require('ssh2').Client;

const sdSSHModule = function(config) {
  const mod = this;
  mod.config = config;
  mod.debug = true;

  mod.command = (cmd, cb) => {
    if (mod.debug){
      console.log(cmd);
    }
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
      host: mod.config.hostAddr,
      port: mod.config.port,
      username: mod.config.username,
      privateKey: require('fs').readFileSync(mod.config.keyFile)
    });
  }

  mod.test = (cb) => {
    mod.command('uptime', cb);
  }

  mod.findPhpModule = (name, cb) => {
    const cmd = `if php -m | grep -q '${name}'; then echo '${name} found'; else echo '${name} not found'; fi`;
    mod.command(cmd, cb);
  }

  mod.checkSSLExpiration = (url, cb) => {
    const cmd = `openssl s_client -servername ${url} -connect ${url}:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter`;
    mod.command(cmd, cb);
  }
}

module.exports = sdSSHModule;
