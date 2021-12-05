'use strict';
const sdNightmareModule = require('./sdNightmare.module.js');
const sdNightmare = new sdNightmareModule();

const drupal7Module = function(){
  const mod = this;

  // Nightmare login
  mod.login = (url, username, password) => {
    return function(nightmare) {
      return nightmare
      .goto(url + '/user/login')
      .checkCookieConsent()
      .wait('#edit-name')
      .type('#edit-name', username)
      .wait('#edit-pass')
      .type('#edit-pass', password)
      .use(sdNightmare.promptCaptcha())
      .wait('#edit-submit')
      .click('#edit-submit')
      .wait('body.logged-in')
    };
  };

  // Nightmare evaluate status page
  mod.status = (url, data = {}) => {
    return function(nightmare) {
      return nightmare
      .goto(url + '/admin/reports/status')
      .wait('.system-status-report')
      .evaluate((data) => {
        data.status = {};
        Array.from(document.querySelectorAll('.system-status-report tr')).forEach(row => {
          const titleTd = row.querySelectorAll('.status-title');
          let label = '';
          if (titleTd && titleTd[0]){
            label = titleTd[0].innerText.trim();
          }
          label = label.replace(' ','');
          label = label.replace(/[^0-9a-zA-Z]/gi, '');
          const valueTd = row.querySelectorAll('.status-value');
          let value = '';
          if (valueTd && valueTd[0]){
            value = valueTd[0].innerText.trim();
          }
          if(label){
            data.status[label] = value;
          }
        });
        return data
      }, data)
    };
  };

  // Nightmare evaluate available updates
  mod.moduleUpdates = (url, data = {}) => {
    return function(nightmare) {
      return nightmare
      .goto(url + '/admin/reports/updates')
      .wait('#edit-module-filter-show-security')
      .click('#edit-module-filter-show-security')
      // .wait('#edit-module-filter-show-updates')
      // .click('#edit-module-filter-show-updates')
      .wait('table.update .js-hide')
      .evaluate((data) => {
        data.modules = [];
        Array.from(document.querySelectorAll('table.update tr:not(.js-hide)')).forEach(row => {
          if(row.querySelector('.project')){
            let title = '';
            let version = '';
            const project = row.querySelector('.project').innerText;
            if (row.querySelector('.project a')){
              title = row.querySelector('.project a').innerText;
              version = project.replace(title, '');
            } else {
              title = project.split(' ')[0];
              version = project.split(' ')[0];
            }
            console.log(title, version);
            if (row.querySelector('.version-recommended')) {
              const recommended = row.querySelector('.version-recommended .version-details').innerText;
              data.modules.push({
                title: title,
                current: version,
                recommended: recommended
              });
            }
          }
        });
        return data;
      }, data)
    };
  };

  mod.maintenance = (url, username, password, cb) => {
    const nightmare = sdNightmare.Nightmare({ show: true, executionTimeout: 100000, waitTimeout: 100000})
    let data = {};

    nightmare
    .use(mod.login(url, username, password))
    .use(mod.status(url))
    .then(data => {
      // get modules
      nightmare
      .use(mod.moduleUpdates(url, data))
      .end()
      .then(cb)
      .catch(error => {
        console.error(error)
      });
    });
  }
}

module.exports = drupal7Module;
