'use strict';
const sdNightmareModule = require('./sdNightmare.module.js');
const sdNightmare = new sdNightmareModule();

const drupal9Module = function(){
  const mod = this;

  // Nightmare login
  mod.login = (url, username, password, cb) => {
    return function(nightmare) {
      return nightmare
      .goto(url)
      .wait(1000)
      .use(sdNightmare.dismissKlaro())
      .wait('#user-login-form #edit-name')
      .type('#user-login-form #edit-name', username)
      .wait('#user-login-form #edit-pass')
      .type('#user-login-form #edit-pass', password)
      .use(sdNightmare.promptCaptcha())
      .wait('#user-login-form [type="submit"]')
      .click('#user-login-form [type="submit"]')
      .wait('body.user-logged-in');
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
        Array.from(document.querySelectorAll('.system-status-report__entry')).forEach(row => {
          const titleTd = row.querySelectorAll('.system-status-report__status-title');
          let label = '';
          if (titleTd && titleTd[0]){
            label = titleTd[0].innerText.trim();
          }
          var key = label.replace(/ +/g,'_');
          key = key.replace(/[^0-9a-zA-Z_]/gi, '');
          key = key.toLowerCase();
          const valueTd = row.querySelectorAll('.system-status-report__entry__value');
          let value = '';
          if (valueTd && valueTd[0]){
            value = valueTd[0].innerText.trim();
          }
          if(key && label && value){
            data.status[key] = {
              label: label,
              value: value
            };
          }
        });
        return data;
      }, data)
    };
  };

  // Nightmare evaluate available updates
  mod.moduleUpdates = (url, data = {}) => {
    return function(nightmare) {
      return nightmare
      .goto(url + '/admin/reports/updates')
      .wait('table.update') // wait for results
      .evaluate((data) => {
        data.modules = [];
        if(!document.querySelector('.module-filter-no-results')){
          Array.from(document.querySelectorAll('table.update tr:not(.js-hide)')).forEach(row => {
              let mod = {};
              mod.type = row.querySelector('.project-update__status').className.replace('project-update__status--','').replace('project-update__status','').trim();
              mod.status = row.querySelector('.project-update__status').innerText.trim();
              mod.title = row.querySelector('.project-update__title a').innerText.trim();
              mod.currentVersion = row.querySelector('.project-update__title').innerText.replace(mod.title, '').trim();
              if (row.querySelector('.project-update__version--recommended:not(.version-also-available)')){
                  mod.recommendedVersion = row.querySelector('.project-update__version--recommended .project-update__version-details a').innerText.trim();
                  mod.recommendedVersionDate = row.querySelector('.project-update__version--recommended .project-update__version-details .project-update__version-date').innerText.trim();
              }
              data.modules.push(mod);
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
      .goto(url + '/admin/reports/dblog?type%5B%5D=php&severity%5B%5D=3')
      .wait('.admin-dblog')
      .evaluate((data, url) => {
        data.errors = [];
        if (!document.querySelector('.views-table .view-empty') && document.querySelectorAll('.views-table tbody tr').length > 0){
          Array.from(document.querySelectorAll('.views-table tbody tr')).forEach( row => {
            const errorMsg = {};
            errorMsg.date = row.querySelector('.views-field-timestamp').innerText.trim();
            errorMsg.message = row.querySelector('.views-field-message').innerText.trim();
            errorMsg.link = url + row.querySelector('.views-field-message a').getAttribute('href');
            errorMsg.user = row.querySelector('.views-field-name').innerText.trim();
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
    .use(mod.login(url, username, password, cb))
    .wait(1000)
    .evaluate(() => {
      if (document.body.className.indexOf('logged-in') > -1
          && !(document.body.className.indexOf('not-logged-in') > -1
        )){
            return true;
      } else {
        return false;
      }
    })
    .end()
    .then(cb)
    .catch(error => {
      console.error(error)
    });
  }

  mod.maintenance = (url, loginPage, username, password, cb) => {
    const nightmare = sdNightmare.Nightmare({ show: true, executionTimeout: 100000, waitTimeout: 100000})
    let data = {};
    let loginURL = url + loginPage;

    nightmare
    .use(mod.login(loginURL, username, password))
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

module.exports = drupal9Module;
