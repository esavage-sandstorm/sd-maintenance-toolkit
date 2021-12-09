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
      .use(sdNightmare.dismissKlaro())
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
      .wait(3000) // wait for things to be hidden
      .evaluate((data) => {
        data.modules = [];
        if(!document.querySelector('.module-filter-no-results')){
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
        }
        return data;
      }, data)
    };
  };

  // Nightmare get a list of PHP errors
  mod.PhpErrors = (url, data = {}) => {
    return function(nightmare) {
      return nightmare
      .goto(url + '/admin/reports/dblog')
      .wait('#edit-filters .fieldset-legend')
      .click('#edit-filters .fieldset-legend')
      .wait(1000)
      .wait('#edit-type [value="php"]') // type = PHP
      .select('#edit-type', 'php')
      .wait('#edit-severity [value="3"]') // severity = Error
      .select('#edit-severity', '3')
      .click('#dblog-filter-form .form-submit')
      // .wait('#admin-dblog tbody tr')
      .wait(3000)
      .evaluate((data, url) => {
        data.errors = [];
        if (!document.querySelector('#admin-dblog .empty.message')){
          Array.from(document.querySelectorAll('#admin-dblog tbody tr')).forEach( row => {
            const errorMsg = {};
            errorMsg.date = row.querySelector('td:nth-child(3)').innerText;
            errorMsg.message = row.querySelector('td:nth-child(4)').innerText;
            errorMsg.link = url + row.querySelector('td:nth-child(4) a').getAttribute('href');
            errorMsg.user = row.querySelector('td:nth-child(5)').innerText;
            data.errors.push(errorMsg);
          });
        }
        return data;
      }, data, url)
    };
  }

  /**
   * Log in to Drupal.
   * Returns true / false
   */
  mod.testLogin = (url, username, password, cb) => {
    const nightmare = sdNightmare.Nightmare({ show: true, executionTimeout: 100000, waitTimeout: 100000})

    nightmare
    .use(mod.login(url, username, password))
    .evaluate(() => document.body.className.indexOf('logged-in') > -1) // check if logged in
    .end()
    .then(cb)
    .catch(error => {
      console.error(error)
    });
  }

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
      .then(data => {
        // get errors
        nightmare
        .use(mod.PhpErrors(url, data))
        .end()
        .then(cb)
        .catch(error => {
          console.error(error)
        });
      });
    });
  }
}

module.exports = drupal7Module;
