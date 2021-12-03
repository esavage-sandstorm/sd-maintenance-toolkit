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
}

module.exports = sdNightmareModule;
