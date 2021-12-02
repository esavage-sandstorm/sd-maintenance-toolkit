'use strict';

const Nightmare = require('nightmare')

const sdNightmareModule = function(){
  const mod = this;

  mod.test = (cb) => {
    const nightmare = Nightmare({ show: true })

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
}

module.exports = sdNightmareModule;
