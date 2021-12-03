'use strict';

const Nightmare = require('nightmare')

const sdNightmareModule = function(){
  const mod = this;

  mod.test = (cb) => {
    const nightmare = Nightmare({ show: false })

    nightmare
      .goto('https://duckduckgo.com')
      .type('#search_form_input_homepage', 'github nightmare')
      .click('#search_button_homepage')
      .wait('#r1-0 a.result__a')
      .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
      .end()
      .then(cb)
      .catch(error => {
        console.error('Search failed:', error)
      });
  }

  mod.testGoogleAnalyticsRunning = (url, cb) => {
    const nightmare = Nightmare({ show: false });

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

    const nightmare = Nightmare({ show: true })

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
      // .wait(`#${formId} ${data.submitSelector}`)
      // .click(`#${formId} ${data.submitSelector}`)
      // .wait(5000)
      .evaluate(() => `Form submitted at ${new Date().toString()}`)
      .end()
      .then(cb)
      .catch(error => {
        console.error('Search failed:', error)
      });
  }
}

module.exports = sdNightmareModule;
