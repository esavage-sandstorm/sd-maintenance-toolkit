'use strict';

const Nightmare = require('nightmare');

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
    // allow insecure connections to local hosts
    config.switches = {
      'ignore-certificate-errors': true
    };
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
      const response = {
        reporting: false,
        client_id: '',
        property_id: ''
      }
      if (window.ga){
        response.client_id = window.ga.getAll()[0].get('clientId');
        response.reporting = true;
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
              response.property_id = m[1];
              response.reporting = true;
            }
          }
        });
        return response;
      }
    })
    .end()
    .then(cb)
    .catch(error => {
      console.error('Search failed:', error)
    });
  }
  // serialize form data and return
  mod.getForm = (data, cb) => {
    const url = data.url;
    const id = data.id ? data.id : null;
    const nightmare = mod.Nightmare({ show: true, executionTimeout: 600000, waitTimeout: 600000});
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
      .wait('form')
      .evaluate((id = null) => {
        if (id){
          const $form = jQuery('#'+id);
          const $copyBtn = jQuery('<button style="position:fixed;top:50%;right:0;z-index: 100;" type="button">save form data</button>');
          $copyBtn.click(function(e) {
            window.formSerial = $form.serializeArray();
            window.formId = $form.attr('id');
          });
          $form.prepend($copyBtn);
        } else {
          jQuery('form').each(function(){
            const $form = jQuery(this);
            const $copyBtn = jQuery('<button type="button">save form data</button>');
            $copyBtn.click(function(e) {
              window.formSerial = $form.serializeArray();
              window.formId = $form.attr('id');
            });
            $form.prepend($copyBtn);
          })
        }
      }, id)
      .wait(function() {
        var attempt = 0;
        function getFormData() {
          if (window.formSerial && window.formId) {
            return true;
          }
          else {
            attempt++;

            if ( attempt < 1000 ) {
              setTimeout(getFormData,1000);
            }
            else {
              return true;
            }
          }
        }
        return getFormData();
      })
      .evaluate( () => {
        return {
          form_id: window.formId,
          form_data: window.formSerial
        }
      })
      .end()
      .then(cb)
      .catch(error => {
        console.error('Search failed:', error)
      });
  }
  mod.testForm = (data, cb) => {
    const url = data.url;
    const formId = data.id.replace('#','');
    const formData = data.formData;
    const nightmare = mod.Nightmare({show: false});

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
      .wait(`#${formId}`)
      .evaluate((formData, formId) => {
        const $form = jQuery('#'+formId);
        formData.forEach(item => {
          jQuery('#'+formId).find('[name="'+item.name+'"]').val(item.value);
        });
        $form.submit();
      }, formData, formId)
      .wait(10000)
      .evaluate(() => `Form submitted at ${new Date().toString()}`)
      .end()
      .then(cb)
      .catch(error => {
        console.error('Search failed:', error)
      });
  }

  mod.dismissKlaro = () => {
    return function(nightmare) {
      return nightmare
      .evaluate(() => {
        if (document.querySelectorAll('#klaro .cookie-notice button.accept-all').length > 0) {
          document.querySelectorAll('#klaro .cookie-notice button.accept-all')[0].click();
        }
      })
      .wait(function() {
        var attempt = 0;
        function verifyKlaro(done = false) {
          if (document.querySelectorAll('#klaro .cookie-notice').length == 0) {
            return true;
          }
          else {
            attempt++;

            if ( attempt < 1000 ) {
              setTimeout(verifyKlaro, 1000);
            }
            else {
              return true;
            }
          }
        }
        return verifyKlaro();
      });
    }
  }

  mod.promptCaptcha = () => {

    return function(nightmare) {
      return nightmare
      // tell the user to do the captcha.
      .evaluate(() => {
        if (document.querySelectorAll('.g-recaptcha').length > 0) {
          window.sdNightmare = window.sdNightmare || {}
          let instructions = document.createElement("p");
          let n = 20;
          var recaptcha = document.querySelector('.g-recaptcha');
          instructions.innerText = `Complete the captcha...`;
          recaptcha.parentNode.insertBefore(instructions, recaptcha);
          instructions.scrollIntoView();
        } else {
          window.sdNightmare.noCaptchaFound = true;
        }
      })
      // wait for the captcha to be completed.
      .wait(function() {
        var attempt = 0;
        function verifyCaptcha() {
          console.log('verify captcha');
          if (window.sdNightmare.noCaptchaFound || !(document.querySelectorAll('.g-recaptcha').length > 0) || (grecaptcha && grecaptcha.getResponse().length !== 0)) {
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

  mod.googlePageSpeed = (testUrl, cb) =>{
    const url = 'https://developers.google.com/speed/pagespeed/insights/?url='+encodeURIComponent(testUrl);
    const nightmare = mod.Nightmare({ show: true, executionTimeout: 100000, waitTimeout: 100000});
    nightmare
    .goto(url)
    .wait(function() {
      var attempt = 0;
      function waitForAnalysis() {
        if (window.__LIGHTHOUSE_JSON__ && window.__LIGHTHOUSE_JSON__.fetchTime) {
            return true;
        }
        else {
          attempt++;

          if ( attempt < 5000 ) {
            setTimeout(waitForAnalysis, 1000);
          }
          else {
            return true;
          }
        }
      }
      return waitForAnalysis();
    })
    .evaluate(() => window.__LIGHTHOUSE_JSON__ )
    .end()
    .then(cb)
    .catch(error => {
      console.error('Search failed:', error)
    });
  }

  mod.getLatestPHPversion = (v, cb) => {
    const nightmare = mod.Nightmare();
    nightmare
    .goto('https://php.net')
    .wait('.download ul')
    .evaluate((current) => {
      var c = current.split('.').slice(0, 2).join('.');
      var latestVersions = Array.from(document.querySelectorAll('.download .download-link')).map((td) => td.innerText);
      return latestVersions.filter(v => {
        return v.indexOf(c) == 0;
      })[0];
    }, v)
    .end()
    .then(cb)
    .catch(error => {
      console.error('Search failed:', error)
    });
  }
}

module.exports = sdNightmareModule;
