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
}

module.exports = sdClientModule;
