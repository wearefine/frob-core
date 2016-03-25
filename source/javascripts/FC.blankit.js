/* globals FCH, FC */

(function() {
  'use strict';

  FC.blankit = {
    ready: function() {
      var links = document.getElementByTagName('a');

      for (var i = 0; i < links.length; i++) {
        if ( links[i].hasAttribute('href') && links[i].getAttribute('href').indexOf(window.location.hostname) === -1 ) {
          links[i].setAttribute('target', '_blank');
        }
      }
    }
  };
})();
