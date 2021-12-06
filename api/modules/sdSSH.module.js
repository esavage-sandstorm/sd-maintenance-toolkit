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

  mod.textToKey = (text) => {

  }

  mod.parseShellTable = (data) => {
    const rows = data.split("\n");
    const labels = rows.splice(0, 1)[0].split(/\s{2,}|\s(?=[A-Z])/);
    console.log('labels', labels);
    let items = [];
    rows.forEach((row) => {
      const columns = row.split(/\s+/);
      if (columns.length == labels.length + 1){
        labels.unshift('name');
      }
      const item = {};
      columns.forEach((col, i) => {
        var key = labels[i].trim().toLowerCase().replace('%', ' percent').replace(/[^a-z]+/g, '_').trim('_');
        item[key] = col.trim();
      });
      items.push(item);
    });
    return items;
  }

  mod.serverMemory = (cb) => {
    const cmd = `free -mh`;
    const parseMem = (data) => {
      const memory = mod.parseShellTable(data);
      cb(memory);
    };

    mod.command(cmd, parseMem);
  }

  mod.serverDiskSpace = (cb) => {
    const cmd = `df -h`;

    const parseSpace = (data) => {
      const space = mod.parseShellTable(data);
      cb(space);
    }

    mod.command(cmd, parseSpace);
  }

  mod.phpVersion = (cb) => {
    const cmd = `php -v | grep '(cli) (built:' | cut -d' ' -f2`;
    mod.command(cmd, cb);
  }
}

module.exports = sdSSHModule;
