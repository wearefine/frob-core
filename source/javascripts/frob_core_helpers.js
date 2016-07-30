/*!
 * FrobCoreHelpers v2.0
 * A framework for front (frob) enders (tenders) everywhere
 * MIT License
 */

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([], factory(window));
  } else if (typeof exports === 'object') {
    module.exports = factory(window);
  } else {
    window.FCH = factory(window);
  }

})(window, function factory(window) {
  'use strict';

  var custom_breakpoints;

  /**
   * Generate a callback holder
   * @class
   * @private
   * @param {String} name - moniker for the hook, e.g. 'ready'
   */
  function Hook(name) {
    this.name = name;
    this.callbacks = [];

    return this;
  }

  Hook.prototype = {
    /**
     * Attach function
     * @param {Function} func - callback to execute
     * @param {Boolean} [fire_immediately=false] - fire the function after adding it to the callbacks
     */
    add: function(func, fire_immediately) {
      fire_immediately = fire_immediately || false;
      this.callbacks.push(func);

      if(fire_immediately) {
        func();
      }
    },

    /**
     * Remove function
     * @param  {Function} func - callback to remove
     */
    remove: function(func) {
      var idx = this.callbacks.indexOf(func);

      this.callbacks.splice(idx, 1);
    },

    /**
     * Fire all associated callbacks
     */
    fire: function() {
      for(var i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i]();
      }
    }
  };

  /**
   * Holder for responsive breakpoints, set on load and reset on resize
   * @private
   * @property {Boolean} small - Window width is less than 768
   * @property {Boolean} small_up - Window width is greater than 767
   * @property {Boolean} medium_portrait - Window width is between 767 and 960
   * @property {Boolean} medium - Window width is between 767 and 1025
   * @property {Boolean} large_down - Window width is less than 1024
   * @property {Boolean} large - Window width is greater than 1024
   * @return {Object}
   */
  function defaultBreakpoints(ww) {
    return {
      small: ww < 768,
      small_up: ww > 767,
      medium_portrait: ww > 767 && ww < 960,
      medium: ww > 767 && ww < 1025,
      large_down: ww < 1024,
      large: ww > 1024
    };
  }

  /**
   * Set a callback that merges the default and original breakpoint listeners
   * @protected
   * @param  {Integer} ww - Window width as called back in this.screenSizes
   * @param  {Integer} wh - Window height as called back in this.screenSizes
   * @see  FrobCoreHelpers#screenSizes
   * @return {Object}
   */
  function mergeBreakpoints(ww, wh) {
    var breakpoints_combined = [defaultBreakpoints(ww, wh), custom_breakpoints(ww, wh)];

    // Empty object to hold combined keys. Custom will override default if using same key
    var new_breakpoints = {};

    // Loop through both functions and their keys
    for(var i = 0; i < breakpoints_combined.length; i++) {
      var breakpoint_wrapper = breakpoints_combined[i];
      var keys = Object.keys(breakpoint_wrapper);

      for(var x = 0; x < keys.length; x++) {
        var key = keys[x];

        // Add to object
        new_breakpoints[key] = breakpoint_wrapper[key];
      }
    }

    return new_breakpoints;
  }

  /**
   * Fire events more efficiently
   * @private
   * @param {String} type - Listener function to trump
   * @param {String} name - New name for listener
   * @param {Object} [obj=window] - Object to bind/watch (defaults to window)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Events/scroll}
   */
  function throttle(type, name, obj) {
    obj = obj || window;
    var running = false;

    function func() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  }

  /**
   * Actually bind the listeners to objects
   * @private
   */
  function attachListeners() {
    var listener = 'optimized';
    var _this = this;

    // Optimized fires a more effective listener but the method isn't supported in all browsers
    if(typeof CustomEvent === 'function') {
      throttle('resize', 'optimizedresize');
      throttle('scroll', 'optimizedscroll');
    } else {
      listener = '';
    }

    window.addEventListener(listener + 'scroll', function() {
      _this.scroll.fire();
    });
    window.addEventListener(listener + 'resize', function() {
      _this.resize.fire();
    });
    document.addEventListener('DOMContentLoaded', function() {
      _this.ready.fire();
    });
    window.addEventListener('load', function() {
      _this.load.fire();
    });
  }

  /**
   * Start everything up
   */
  var FrobCoreHelpers = {
    scroll: new Hook('scroll'),
    resize: new Hook('resize'),
    ready: new Hook('ready'),
    load: new Hook('load'),
    breakpoints: defaultBreakpoints,

    /**
     * @property {Function} breakpoints - To set custom breakpoint, pass a function with two args and return a `string: boolean` object
     *   @property {Integer} ww - Window width
     *   @property {Integer} wh - Window height
     *   @return {Object} - key is identifier, i.e. small; value is a comparison, i.e. ww < 767
     * @property {Boolean} [override_breakpoints=false] - Replace custom breakpoints with default breakpoints
     */
    setBreakpoints: function(breakpoints, override_breakpoints) {
      var dimensionsBreakpointsListener = this.screenSizes();
      override_breakpoints = override_breakpoints || false;

      // If we're merging the breakpoints, ensure breakpoints option object exists
      if(override_breakpoints) {
        this.breakpoints = breakpoints;

      } else {
        custom_breakpoints = breakpoints;

        // Set the callback
        this.breakpoints = mergeBreakpoints;
      }

      // Init this.dimensions and this.bp
      dimensionsBreakpointsListener();
      this.resize.add( dimensionsBreakpointsListener );

      return this;
    },

    /**
     * Apply value to variable if it has none
     * @param {var} variable - variable to set default to
     * @param {*} value - default value to attribute to variable
     * @return {*} Existing value or passed value argument
     */
    setDefault: function(variable, value){
      return (typeof variable === 'undefined') ? value : variable;
    },

    /**
     * Nice, unjanky scroll to element
     * @param {jQuery} $target - Scroll to the top of this object
     * @param {Number} [duration=2000] - How long the scroll lasts
     * @param {Number} [delay=100] - How long to wait after trigger
     * @param {Number} [offset=0] - Additional offset to add to the scrollTop
     */
    smoothScroll: function($target, duration, delay, offset){
      duration = this.setDefault(duration, 2000);
      delay = this.setDefault(delay, 100);
      offset = this.setDefault(offset, 0);

      setTimeout(function(){
        $('html, body').animate({
          scrollTop: $target.offset().top + offset
        }, duration);
      }, delay);
    },

    /**
     * Clear value of localstorage object. If no key is passed, clear all objects
     * @param {String} [key] - Accessible identifier
     * @return {Undefined|Boolean} Result of clear or removeItem action
     */
    localClear: function(key){
      try {
        if(typeof key === 'undefined') {
          localStorage.clear();
        } else {
          localStorage.removeItem(key);
        }
      } catch(e) {
        return false;
      }
    },

    /**
     * Retrieve localstorage object value
     * @param {String} key - Accessible identifier
     * @return {String|Object|Boolean} Value of localStorage object or false if key is undefined
     */
    localGet: function(key) {
      // localStorage is unavailable in some incognito/private browsers
      try {
        if(localStorage.getItem(key)) {
          var value = localStorage.getItem(key);

          if(value.indexOf('{') === 0) {
            return JSON.parse( value );
          } else {
            return value;
          }
        } else {
          return false;
        }
      } catch(e) {
        return false;
      }
    },

     /**
     * Store a string locally
     * @param {String} key - Accessible identifier
     * @param {String|Object} obj - Value of identifier
     * @return {String} Value of key in localStorage
     */
    localSet: function(key, obj) {
      var value;

      if(obj.constructor === String) {
        value = obj;
      } else {
        value = JSON.stringify(obj);
      }

      try {
        localStorage.setItem(key, value);
      } catch(e) {
        // noop
      }

      return value;
    },

    /**
     * Check for existence of element on page
     * @param {String} query - JavaScript object
     * @return {Boolean}
     */
    exists: function(query) {
      return !!document.querySelector(query);
    },

    /**
     * Provides accessible booleans for fluctuating screensizes; only fire when queried
     * @sets this.dimensions
     * @sets this.bp
     * @fires this.breakpoints
     */
    screenSizes: function() {
      var _this = this;

      return function() {
        var ww = window.innerWidth;
        var wh = window.innerHeight;

        /**
         * dimensions
         * @namespace
         * @description Holder for screen size numbers, set on load and reset on resize
         * @property {Number} ww - Window width
         * @property {Number} wh - Window height
         */
        _this.dimensions = {
          ww: ww,
          wh: wh
        };

      /**
       * bp
       * @namespace
       * @description Sets boolean values for screen size ranges
       * @fires this.breakpoints
       * @see {@link defaultBreakpoints}
       * @see {@link mergeBreakpoints}
       */
        _this.bp = _this.breakpoints.call(null, ww, wh);
      };
    },

    /**
     * Goes through all elements and performs function for each item
     * @private
     * @param {Array|String} selector - Array, NodeList or DOM selector
     * @param {Function} callback
     *   @param {Node} item - Current looped item
     *   @param {Integer} index - Index of current looped item
     */
    loop: function(selector, callback) {
      var items;

      if(selector.constructor === Array || selector.constructor === NodeList) {
        items = selector;
      } else {
        items = document.querySelectorAll(selector);
      }

      for(var i = 0; i < items.length; i++) {
        callback( items[i], i );
      }
    },

    /**
     * Fire event only once
     * @param {Function} func - Function to execute on debounced
     * @param {Integer} [threshold=250] - Delay to check if func has been executed
     * @see {@link http://unscriptable.com/2009/03/20/debouncing-javascript-methods/}
     * @example
     *   FCH.resize.push( FCH.debounce( this.resourceConsumingFunction.bind(this) ) );
     * @return {Function} Called func, either now or later
     */
    debounce: function(func, threshold) {
      var timeout;

      return function() {
        var obj = this, args = arguments;

        function delayed () {
          timeout = null;
          func.apply(obj, args);
        }

        if (timeout) {
          clearTimeout(timeout);
        } else {
          func.apply(obj, args);
        }

        timeout = setTimeout(delayed, threshold || 250);
      };
    },

    /**
     * Check for external links, set target blank if external
     */
    blankit: function() {
      var links = document.getElementsByTagName('a');

      this.loop('a', function(link) {
        if ( /^http/.test(link.getAttribute('href')) ) {
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  // Cached jQuery variables
  if(typeof jQuery !== 'undefined') {
    /** @type {jQuery} */
    FrobCoreHelpers.$body = jQuery('body');
    /** @type {jQuery} */
    FrobCoreHelpers.$window = jQuery(window);
    /** @type {jQuery} */
    FrobCoreHelpers.$document = jQuery(document);
  }

  attachListeners.call(FrobCoreHelpers);

  return FrobCoreHelpers;
});
