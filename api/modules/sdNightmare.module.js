'use strict';

const Nightmare = require('nightmare');

//define a new Nightmare method named "textExtract"
//note that it takes a selector as a parameter
Nightmare.action('checkCookieConsent', function(done){
  this.evaluate_now(() => {
    // dismiss Klaro cookie consent if present
    const $klaroBtn = jQuery('.cm-btn-success');
    if ($klaroBtn.length > 0){
      $klaroBtn.click();
    }
  }, done)
  .wait(2000)
});

Nightmare.action('promptCaptcha', function(done) {
  //`this` is the Nightmare instance
  this.evaluate_now(() => {
    if (document.querySelectorAll('.g-recaptcha').length > 0) {
      let instructions = document.createElement("p");
      let n = 10;
      var recaptcha = document.querySelector('.g-recaptcha');
      recaptcha.parentNode.insertBefore(instructions, recaptcha)
      instructions.scrollIntoView();
      var countDown = setInterval(function() {
        if (n == 1){
          clearInterval(countDown);
        }
        instructions.innerText = `Click the captcha. You have ${n} seconds`;
        n--;
      }, 1000);
    }
  }, done)
  .wait(10000)
});

Nightmare.action('show',
  function(name, options, parent, win, renderer, done) {
    parent.respondTo('show', function(inactive, done) {
      if(inactive) {
        win.showInactive();
      } else {
        win.show();
      }
      done();
    });
    done();
  },
  function(inactive, done) {
    this.child.call('show', inactive, done);
  }
);

Nightmare.action('hide',
  function(name, options, parent, win, renderer, done) {
    parent.respondTo('hide', function(done) {
      win.hide();
      done();
    });

    done();
  },
  function(done) {
    this.child.call('hide', done);
  }
);

const sdNightmareModule = function(){
  const mod = this;

  mod.Nightmare = (config = {show: false}) => {
    return Nightmare(config);
  }

  mod.testGoogleAnalyticsRunning = (url, cb) => {
    const nightmare = mod.Nightmare();

    nightmare
    .goto(url)
    .wait(2000)
    .evaluate(() => {
      // dismiss Klaro cookie consent if present
      const $klaroBtn = jQuery('.cm-btn-success');
      if ($klaroBtn.length > 0){
        $klaroBtn.click();
      }
    })
    .wait(1000)
    .evaluate(() => {
      if (window.ga){
        const clientId = window.ga.getAll()[0].get('clientId');
        let propertyId = '';
        // find the script that created GA
        jQuery('script').each(function() {
          const $script = jQuery(this);
          if ($script.text().indexOf('ga("create",')){
            const regex = /ga\("create", "(UA-[0-9]+-[0-9]+)"/gm;
            let m;

            while ((m = regex.exec($script.text())) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (m.index === regex.lastIndex) {
                  regex.lastIndex++;
              }
              propertyId = m[1];
            }
          }
        });
        if (propertyId){
          return `Reporting (Property Id: ${propertyId})`;
        } else {
          return `Reporting (Client Id: ${clientId})`;
        }
      } else {
        return 'GA not found';
      }
    })
    .end()
    .then(cb)
    .catch(error => {
      console.error('Search failed:', error)
    });
  }

  mod.formSubmit = (data, cb) => {
    const url = data.url;
    const formId = data.formId;
    const fields = data.fields;

    const nightmare = mod.Nightmare();

    nightmare
      .goto(url)
      .wait(1000)
      .evaluate(() => {
        // dismiss Klaro cookie consent if present
        const $klaroBtn = jQuery('.cm-btn-success');
        if ($klaroBtn.length > 0){
          $klaroBtn.click();
        }
      })
      .wait(`#${formId}`);
    data.fields.forEach(field => {
      if (field.type == 'text'){
        nightmare
        .wait(`#${formId} ${field.selector}`)
        .type(`#${formId} ${field.selector}`, field.value);
      }
      if (field.type == 'click') {
        nightmare
        .wait(`#${formId} ${field.selector}`)
        .click(`#${formId} ${field.selector}`);
      }
    });
    if (data.hasCaptcha){
      nightmare.evaluate(() => {
        let instructions = document.createElement("p");
        let n = 15;
        var recaptcha = document.querySelector('.g-recaptcha');
        recaptcha.parentNode.insertBefore(instructions, recaptcha)
        instructions.scrollIntoView();
        var countDown =setInterval(function() {
          if (n == 1){
            clearInterval(countDown);
          }
          instructions.innerText = `Click the captcha. You have ${n} seconds`;
          n--;
        }, 1000);
      })
      .wait(13000);
    }
    nightmare
      .wait(2000)
      // submit
      .wait(`#${formId} ${data.submitSelector}`)
      .click(`#${formId} ${data.submitSelector}`)
      .wait(5000)
      .evaluate(() => `Form submitted at ${new Date().toString()}`)
      .end()
      .then(cb)
      .catch(error => {
        console.error('Search failed:', error)
      });
  }

  mod.promptCaptcha = () => {
    return function(nightmare) {
      return nightmare
      // tell the user to do the captcha.
      .evaluate(() => {
        if (document.querySelectorAll('.g-recaptcha').length > 0) {
          let instructions = document.createElement("p");
          let n = 20;
          var recaptcha = document.querySelector('.g-recaptcha');
          instructions.innerText = `Complete the captcha...`;
          recaptcha.parentNode.insertBefore(instructions, recaptcha);
          instructions.scrollIntoView();
        }
      })
      // wait for the captcha to be completed.
      .wait(function() {
        var attempt = 0;
        function verifyCaptcha() {
          if (!(document.querySelectorAll('.g-recaptcha').length > 0) || (grecaptcha && grecaptcha.getResponse().length !== 0)) {
              return true;
          }
          else {
            attempt++;

            if ( attempt < 1000 ) {
              setTimeout(verifyCaptcha,1000);
            }
            else {
              return true;
            }
          }
        }
        return verifyCaptcha();
      });
    };
  };

  // mod.drupal7Login = (url, username, password) => {
  //   return function(nightmare) {
  //     return nightmare
  //     .goto(url + '/user/login')
  //     .checkCookieConsent()
  //     .wait('#edit-name')
  //     .type('#edit-name', username)
  //     .wait('#edit-pass')
  //     .type('#edit-pass', password)
  //     .use(mod.promptCaptcha())
  //     .wait('#edit-submit')
  //     .click('#edit-submit')
  //     .wait('body.logged-in')
  //   };
  // };

  // mod.drupal7Status = (url, data = {}) => {
  //   return function(nightmare) {
  //     return nightmare
  //     .goto(url + '/admin/reports/status')
  //     .wait('.system-status-report')
  //     .evaluate((data) => {
  //       data.status = {};
  //       Array.from(document.querySelectorAll('.system-status-report tr')).forEach(row => {
  //         const titleTd = row.querySelectorAll('.status-title');
  //         let label = '';
  //         if (titleTd && titleTd[0]){
  //           label = titleTd[0].innerText.trim();
  //         }
  //         label = label.replace(' ','');
  //         label = label.replace(/[^0-9a-zA-Z]/gi, '');
  //         const valueTd = row.querySelectorAll('.status-value');
  //         let value = '';
  //         if (valueTd && valueTd[0]){
  //           value = valueTd[0].innerText.trim();
  //         }
  //         if(label){
  //           data.status[label] = value;
  //         }
  //       });
  //       return data
  //     }, data)
  //   };
  // };

  // mod.drupal7ModuleUpdates = (url, data = {}) => {
  //   return function(nightmare) {
  //     return nightmare
  //     .goto(url + '/admin/reports/updates')
  //     .wait('#edit-module-filter-show-security')
  //     .click('#edit-module-filter-show-security')
  //     // .wait('#edit-module-filter-show-updates')
  //     // .click('#edit-module-filter-show-updates')
  //     .wait('table.update .js-hide')
  //     .evaluate((data) => {
  //       data.modules = [];
  //       Array.from(document.querySelectorAll('table.update tr:not(.js-hide)')).forEach(row => {
  //         if(row.querySelector('.project')){
  //           let title = '';
  //           let version = '';
  //           const project = row.querySelector('.project').innerText;
  //           if (row.querySelector('.project a')){
  //             title = row.querySelector('.project a').innerText;
  //             version = project.replace(title, '');
  //           } else {
  //             title = project.split(' ')[0];
  //             version = project.split(' ')[0];
  //           }
  //           console.log(title, version);
  //           if (row.querySelector('.version-recommended')) {
  //             const recommended = row.querySelector('.version-recommended .version-details').innerText;
  //             data.modules.push({
  //               title: title,
  //               current: version,
  //               recommended: recommended
  //             });
  //           }
  //         }
  //       });
  //       return data;
  //     }, data)
  //   };
  // };

  // mod.drupal7Maintenance = (url, username, password, cb) => {
  //   const nightmare = Nightmare({ show: true, executionTimeout: 100000, waitTimeout: 100000})
  //   let data = {};

  //   nightmare
  //   .use(mod.drupal7Login(url, username, password))
  //   .use(mod.drupal7Status(url))
  //   .then(data => {
  //     // get modules
  //     nightmare
  //     .use(mod.drupal7ModuleUpdates(url, data))
  //     .end()
  //     .then(cb)
  //     .catch(error => {
  //       console.error(error)
  //     });
  //   });
  // }
}

module.exports = sdNightmareModule;
