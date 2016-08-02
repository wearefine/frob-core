/*globals FCH */

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([], factory(window));
  } else if (typeof exports === 'object') {
    module.exports = factory(window);
  } else {
    window.fcDropdown = factory(window);
  }

})(window, function factory(window) {
  'use strict';


  var defaults = {
    activeClass: 'active',
    listSelector: 'li',
    // All callbacks scoped to the selector element
    onOpen: function() {},
    /**
     * @param {Node} selected - select item
     */
    onSelect: function() {},
    onClose: function() {}
  };

  /**
   * Like jQuery's slideDown function - uses CSS3 transitions
   * @private
   * @param {Node} el Element to show and hide
   * @author https://gist.github.com/ludder/4226288
   */
  function slideDown(el) {
    el.style.maxHeight = '400px';
    // We're using a timer to set opacity = 0 because setting max-height = 0 doesn't (completely) hide the element.
    el.style.opacity = '1';
  }

  /**
   * Slide element up (like jQuery's slideUp)
   * @private
   * @param {Node} el
   * @author https://gist.github.com/ludder/4226288
   */
  function slideUp(el) {
    el.style.maxHeight = '0';
    el.style.opacity = '0';
  }

  /**
   * Determine dropdown menu to open/close upon click
   * @private
   * @param {Node} el - dropdown selector
   * @return {Node} destination JS object
   */
  function findDestination(el) {
    var destination;

    // If href is defined, use the href to find the destination dropdown (if it's blank, use the next DOM element)
    if( el.hasAttribute('href') ) {
      destination = el.getAttribute('href') === '#' ? el.nextElementSibling : document.querySelector( el.getAttribute('href') );
    } else {
      destination = el.nextElementSibling;
    }

    return destination;
  }


  /**
   * Initialize dropdown
   * @param {String} selector - DOM selector
   * @param {Object} [settings={}] - hash of options
   *   @property {String} [activeClass=active] - class applied to list item once selection is made
   *   @property {String} [listSelector=li] - node selector to search for in list
   *   @property {Function} [onOpen=noop] - callback once menu is opened
   *   @property {Function} [onSelect=noop] - callback once selection is made; first argument is the selected list item as a Node
   *   @property {Function} [onClose=noop] - callback once menu is closed
   * @returns {fcDropdown}
   */
  return function(selector, settings) {
    settings = FCH.setDefault(settings, {})

    // Loop through default params
    for(var i = 0; i < Object.keys(defaults).length; i++) {
      var key = Object.keys(defaults)[i];

      // If settings does not have the default key, apply it
      if(!settings.hasOwnProperty(Object.keys(defaults)[i])) {
        settings[key] = defaults[key];
      }
    }

    // Loop through and initialize all desired selectors IF they're present
    if(FCH.exists(selector)) {
      FCH.loop(selector, function(item) {
        initDropdownElement( item );
      });
    }

    /**
     * Selector click event listener
     * @private
     * @param {Event} e
     * @fires dropDownOpen
     * @fires dropDownClose
     */
    function onSelectorClick(e) {
      e.preventDefault();
      var el = e.currentTarget;
      var destination = findDestination(this);

      // Collapse all other dropdowns except the desired one
      FCH.loop('.fcdropdown-destination', function(item) {
        if(item !== destination) {
          slideUp( item );
        }
      });

      // Remove active class from all other selectors save the one chosen
      FCH.loop('.fcdropdown-selector', function(item) {
        if(item !== el) {
          FCH.removeClass( item, settings.activeClass );
        }
      });

      if( FCH.hasClass( this, settings.activeClass ) ) {
        dropDownClose.call(this, destination);
      } else {
        dropDownOpen.call(this, destination);
      }
    }

    /**
     * Initialize drop down based on the selector
     * @private
     * @param {Node} el - JS object that will serve as the selector and label
     */
    function initDropdownElement(el) {
      /** @type {Node} */
      var destination = findDestination(el);

      // Add classes for styling
      FCH.addClass(destination, 'fcdropdown-destination');
      FCH.addClass(el, 'fcdropdown-selector');

      // Attach click event to selector
      el.addEventListener('click', onSelectorClick, false);

      // On select of dropdown optiosn
      var children = destination.querySelectorAll(settings.listSelector);

      /**
       * Respond to click event on destination's list item
       * @private
       * @param {Event} e
       */
      function onListSelectorClick(e) {
        e.preventDefault();
        var selected = this;
        var userSelect = settings.onSelect.call( el, selected );

        // Remove active class from children
        FCH.loop(children, function(item) {
          FCH.removeClass( item, settings.activeClass );
        });

        // Add active class to this object
        FCH.addClass( selected, settings.activeClass );

        // If onSelect callback is not false, update selector's label
        if( userSelect !== false) {
          el.textContent = selected.textContent;
        }

        // Close destination
        dropDownClose.call(el, destination);
      }

      // Add selector listener to all children
      FCH.loop(children, function(item) {
        item.addEventListener('click', onListSelectorClick, false);
      });
    }

    /**
     * Fires on destination close
     * @param {Node} el - selector JS object
     * @param {Node} destination - destination JS object
     */
    function dropDownClose(destination) {
      var userClose = settings.onClose.call( this );

      if( userClose !== false ) {
        FCH.removeClass( this, settings.activeClass );
        slideUp( destination );
      }
    }

    /**
     * Fires on destination open
     * @param {Node} el - selector JS object
     * @param {Node} destination - destination JS object
     */
    function dropDownOpen(destination) {
      var userOpen = settings.onOpen.call( this );

      if( userOpen !== false ) {
        FCH.addClass( this, settings.activeClass );
        slideDown( destination );
      }
    }

    return this;
  }

});
