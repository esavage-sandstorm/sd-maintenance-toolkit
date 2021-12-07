'use strict';
const fs = require('fs');
const YAML = require('json-to-pretty-yaml');

const sdClientModule = function(){
  const mod = this;
  const dir = './clients';

  mod.save = (client, cb) => {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    const data = YAML.stringify(client);
    console.log(data);
    const outputFile = dir + '/' + client.name + '.yaml';
    fs.writeFile(outputFile, data, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    });
    cb(client);
  }

  mod.getClients = (cb) => {
    const clients = [];
    clientFiles = fs.readdirSync(dir, { withFileTypes: true });
    clientFiles.forEach(file => {
      const data = fs.readFileSync(dir + '/'+file, {encoding:'utf8', flag:'r'});
      const client = YAML.parse(data);
      clients.push(client);
    });
    cb(clients);
  }
}

module.exports = sdClientModule;
