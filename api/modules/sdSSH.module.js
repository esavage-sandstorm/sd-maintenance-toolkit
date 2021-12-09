'use strict';
var Client = require('ssh2').Client;

const sdSSHModule = function(config) {
  const mod = this;
  mod.config = config;
  mod.debug = false;

  mod.command = (cmd, cb) => {
    if (!mod.config.host) {
      cb(null, "No `host` provided");
      return false;
    }
    if (!mod.config.username) {
      cb(null, "No `usrename` provided");
      return false;
    }
    if (!mod.config.key_file) {
      cb(null, "No `key_file` provided");
      return false;
    }
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
          console.log('STDERR: ' + data);
          throw err
        });
      });
    }).connect({
      host: mod.config.host,
      port: mod.config.port ? mod.config.port : 22,
      username: mod.config.username,
      privateKey: require('fs').readFileSync(mod.config.key_file)
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
    url = url.replace(/https*:\/\//, '');
    const cmd = `openssl s_client -servername ${url} -connect ${url}:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter`;
    mod.command(cmd, cb);
  }

  mod.parseShellTable = (data) => {
    const rows = data.split("\n");
    const labels = rows.splice(0, 1)[0].split(/\s{2,}|\s(?=[A-Z])/);
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
    const parseMem = (data, err) => {
      if (data){
        const memory = mod.parseShellTable(data);
        cb(memory);
      } else if (err) {
        cb(null, err);
      }
    };

    mod.command(cmd, parseMem);
  }

  mod.serverDiskSpace = (cb) => {
    const cmd = `df -h`;

    const parseSpace = (data, err) => {
      if (data) {
        const space = mod.parseShellTable(data);
        cb(space);
      } else if (err) {
        cb(null, err);
      }
    }

    mod.command(cmd, parseSpace);
  }

  mod.phpVersion = (cb) => {
    const cmd = `php -v | grep '(cli) (built:' | cut -d' ' -f2`;
    mod.command(cmd, cb);
  }
}

module.exports = sdSSHModule;
