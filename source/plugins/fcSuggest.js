/*globals FCH */

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([], factory(window));
  } else if (typeof exports === 'object') {
    module.exports = factory(window);
  } else {
    window.fcSuggest = factory(window);
  }

})(window, function factory(window) {
  'use strict';

  var defaults = {
    displayClass: 'shown',
    activeClass: 'active',
    listSelector: 'li',
    onSelect: function() {},
  };

  /**
   * Combine default options with custom ones
   * @private
   * @param  {Object} options - Key/value object to override `defaults` object
   * @return {Object}
   */
  function applyDefaults(options) {
    options = options || {};

    var default_keys = Object.keys(defaults);

    // Loop through default params
    for(var i = 0; i < default_keys.length; i++) {
      var key = default_keys[i];

      // If options does not have the default key, apply it
      if(!options.hasOwnProperty(key)) {
        options[key] = defaults[key];
      }
    }

    return options;
  }

  /**
   * Create fcSuggest object
   * @class  fcSuggest
   * @param  {Node} selector - input field for search
   * @param  {Object} options - key/value object to override `defaults` object
   *   @property {String} [displayClass=shown] - class applied to list items that match searched criteria
   *   @property {String} [activeClass=active] - class applied to first item or selected list item
   *   @property {String} [listSelector=li] - selector to search for that contains queryable items
   *   @property {Function} [onSelect=noop] - callback for action once list item has been selected
   * @return {fcSuggest}
   */
  function init(selector, options) {
    options = applyDefaults(options);

    var el = document.querySelectorAll(selector);
    // If we're given a greedy selector, initialize for all
    if (el.length > 1) {
      for(var i = 0; i < el.length; i++) {
        init( el[i], options );
      }

      // And stop early
      return;

    } else {
      el = el[0];

    }

    // Find the list
    var list = el.nextSibling;

    // Regenerate in a wrapper
    var wrap = document.createElement('div');
    wrap.className = 'fcsuggest';
    wrap.innerHTML = el.outerHTML + list.outerHTML;

    // Add the background text suggestor
    var suggestor = document.createElement('div');
    suggestor.className = 'fcsuggest-suggestor';
    wrap.appendChild(suggestor);

    // Remove duplicate HTML
    el.parentNode.insertBefore(wrap, el);
    el.parentNode.removeChild(el);
    list.parentNode.removeChild(list);

    // Reassign our variables now that they've been moved around
    el = wrap.querySelector('input');
    list = el.nextSibling;

    // Generate two arrays - one with nodes and one with text - for easy querying later
    var list_items = {}
    FCH.loop( list.querySelectorAll( options.listSelector ), function(item) {
      list_items[ item.textContent.trim() ] = item;
      item.addEventListener('click', options.onSelect);
    });

    // Event listeners
    el.addEventListener('keyup', onKeyupFilter);

    document.body.addEventListener('click', function() {
      suggestor.textContent = '';
      wrap.classList.remove('fcsuggest-active');
    });

    /**
     * Show the list, add active classes to filtered results
     * @param  {Event} e
     */
    function onKeyupFilter(e) {
      var suggestion;

      // Enter up down
      var is_special_action = [13, 38, 40].some(function(val) {
        return e.which === val;
      });

      // Tell the wrapper that the list is active
      wrap.classList.add('fcsuggest-active');

      // If it's a special keycode, handle in a separate function
      if(is_special_action) {
        suggestion = onSpecialKeypress(e.which);

      } else {

        // Find all relevant items based on the input
        var reg = new RegExp(this.value, 'gi');

        var relevant_items = Object.keys(list_items).filter(function(item) {
          return reg.test(item);
        });

        // Remove existing classes
        for(var item in list_items) {
          item = list_items[item];
          item.classList.remove( options.activeClass );
          item.classList.remove( options.displayClass );
        }

        // Add active classes to the items that deserve it
        FCH.loop(relevant_items, function(relevant_text) {
          var el = list_items[relevant_text];
          el.classList.add( options.displayClass );
        });

        suggestion = list_items[ relevant_items[0] ];
      }

      suggestor.textContent = '';

      // Add active class to recommendation and update the suggestion to the latest
      if(suggestion) {
        suggestion.classList.add( options.activeClass );
        suggestor.textContent = suggestion.textContent.trim();
      }
    }

    /**
     * If keypress is enter, down, or up, handle appropriately
     * @param  {Integer} keycode
     * @return {Node} - new active node
     */
    function onSpecialKeypress(keycode) {
      var active_element = list.querySelector( '.' + options.activeClass );
      var new_active_element = active_element;
      var shown_list = Array.prototype.slice.call( list.querySelectorAll( options.listSelector + '.' + options.displayClass ) );
      var active_index = shown_list.indexOf( active_element );

      switch(keycode) {
        // Enter
        case 13 :
          options.onSelect.call( active_element );

        break;
        // Up
        case 38 :
          active_element.classList.remove( options.activeClass );

          // Back to end if we're at beginning
          if(active_index === 0) {
            new_active_element = shown_list[shown_list.length - 1];
          } else {
            new_active_element = shown_list[active_index - 1];
          }

        break;
        // Down
        case 40 :
          active_element.classList.remove( options.activeClass );

          // Back to beginning if we're at the end
          if((active_index + 1) === shown_list.length) {
            new_active_element = shown_list[0];
          } else {
            new_active_element = shown_list[active_index + 1];
          }

        break;
      }

      return new_active_element;
    }

    return this;
  }

  return init;

});
