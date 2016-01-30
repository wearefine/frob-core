
(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([], factory(window));
  } else if (typeof exports === 'object') {
    module.exports = factory(window);
  } else {
    window.FrobCoreHelpers = factory(window);
  }

})(window, function factory(window) {
  'use strict';

  /**
   * Attach hooks on child objects to the listener arrays
   * @private
   * @param {String} listener - Such as 'resize' or 'load'
   * @param {Object} jsHolder - The main JavaScript object being queried; adds functionality for DOM callbacks to all children
   * @see {@link FCH.init}
   */
  function attachChildListeners(listener, jsHolder) {
    var kids = Object.keys(jsHolder);

    // Go through all child objects on the holder
    for(var i = 0; i < kids.length; i++) {
      var kid = kids[i];
      var child = jsHolder[kid];

      if( child.hasOwnProperty(listener) ) {
        var child_func = child[listener];

        child_func.prototype = child;
        this[listener].push( child_func );
      }
    }
  }

  /**
   * Fire events more efficiently
   * @private
   * @param {String} type - Listener function to trump
   * @param {String} name - New name for listener
   * @param {Object} obj - Object to bind/watch (defaults to window)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Events/scroll}
   */
  function throttle(type, name, obj) {
    obj = obj || window;
    var running = false;

    var func = function() {
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
   * Execute listeners using the bundled arrays
   * @private
   * @param {String} listener - What to hear for, i.e. scroll, resize
   */
  function callListener(listener) {
    var listener_array = this[listener];

    for(var x = 0; x < listener_array.length; x++) {
      listener_array[x].call( listener_array[x].prototype );
    }
  }

  /**
   * Actually bind the listeners to objects
   * @private
   */
  function attachListeners() {
    var listener = 'optimized';

    // Optimized fires a more effective listener but the method isn't supported in all browsers
    if(typeof CustomEvent === 'function') {
      throttle('resize', 'optimizedresize');
      throttle('scroll', 'optimizedscroll');
    } else {
      listener = '';
    }

    window.addEventListener(listener + 'scroll', callListener.bind(this, 'scroll') );
    window.addEventListener(listener + 'resize', callListener.bind(this, 'resize') );
    document.addEventListener('DOMContentLoaded', callListener.bind(this, 'ready') );
    window.addEventListener('load', callListener.bind(this, 'load') );
  }

  /**
   * Start everything up
   * @class
   * @param {Object} [jsHolder=FC] - The main JavaScript object being queried; adds functionality for DOM callbacks to all children
   * @example
   * var FC = {
   *   ui: {
   *     resize: function() { ... }
   *   }
   * }
   * FCH.init(FC);
   * @return {FrobCoreHelpers}
   */
  function FrobCoreHelpers(jsHolder) {
    if (typeof FC === 'undefined') {
      var FC = {};
    }

    /* Listener Arrays */
    /** @type {Array.<function>} */
    this.resize = [];
    /** @type {Array.<function>} */
    this.scroll = [];
    /** @type {Array.<function>} */
    this.ready = [];
    /** @type {Array.<function>} */
    this.load = [];

    jsHolder = this.setDefault(jsHolder, FC);

    // IE detection
    this.IE10 = this.isIE(10);
    this.IE9 = this.isIE(9);
    this.anyIE = (this.IE10 || this.IE9);

    this.breakpoints();

    this.resize.push( this.breakpoints.bind(this) );
    this.ready.push( this.mobileFPS.bind(this) );

    /* Cached jQuery variables */
    if(typeof jQuery !== 'undefined') {
      /** @type {jQuery} */
      this.$body = jQuery('body');
      /** @type {jQuery} */
      this.$window = jQuery(window);
      /** @type {jQuery} */
      this.$document = jQuery(document);
    }

    var listeners = ['resize', 'scroll', 'ready', 'load'];
    for(var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      attachChildListeners.call(this, listener, jsHolder);
    }

    attachListeners.call(this);

    return this;
  }

  /**
   * Apply value to variable if it has none
   * @param {var} variable - variable to set default to
   * @param {*} value - default value to attribute to variable
   * @return {*} Existing value or passed value argument
   */
  FrobCoreHelpers.prototype.setDefault = function(variable, value){
    return (typeof variable === 'undefined') ? value : variable;
  };

  /**
   * Nice, unjanky scroll to element
   * @param {jQuery} $target - Scroll to the top of this object
   * @param {Number} [duration=2000] - How long the scroll lasts
   * @param {Number} [delay=100] - How long to wait after trigger
   * @param {Number} [offset=0] - Additional offset to add to the scrollTop
   */
  FrobCoreHelpers.prototype.smoothScroll = function($target, duration, delay, offset){
    duration = this.setDefault(duration, 2000);
    delay = this.setDefault(delay, 100);
    offset = this.setDefault(offset, 0);

    setTimeout(function(){
      $('html, body').animate({
        scrollTop: $target.offset().top + offset
      }, duration);
    }, delay);
  };

  /**
   * Store a string locally
   * @param {String} key - Accessible identifier
   * @param {String} obj - Value of identifier
   * @return {String} Value of key in localStorage
   */
  FrobCoreHelpers.prototype.localSet = function(key, obj) {
    var value = JSON.stringify(obj);
    localStorage[key] = JSON.stringify(obj);

    return value;
  };

  /**
   * Retrieve localstorage object value
   * @param {String} key - Accessible identifier
   * @return {String|Boolean} Value of localStorage object or false if key is undefined
   */
  FrobCoreHelpers.prototype.localGet = function(key) {
    if (typeof localStorage[key] !== 'undefined') {
      return JSON.parse(localStorage[key]);
    } else {
      return false;
    }
  };

  /**
   * Clear value of localstorage object. If no key is passed, clear all objects
   * @param {String} [key] - Accessible identifier
   * @return {Undefined} Result of clear or removeItem action
   */
  FrobCoreHelpers.prototype.localClear = function(key){
    return typeof key === 'undefined' ? localStorage.clear() : localStorage.removeItem(key);
  };

  /**
   * Check if IE is current browser
   * @param {Number|String} version
   * @return {Boolean}
   */
  FrobCoreHelpers.prototype.isIE = function(version) {
    var regex = new RegExp('msie' + (!isNaN(version)?('\\s' + version) : ''), 'i');
    return regex.test(navigator.userAgent);
  };

  /**
   * Check for existence of element on page
   * @param {String} query - JavaScript object
   * @return {Boolean}
   */
  FrobCoreHelpers.prototype.exists = function(query) {
    return !!document.querySelector(query);
  };

  /**
   * Provides accessible booleans for fluctuating screensizes
   */
  FrobCoreHelpers.prototype.breakpoints = function() {
    var ww, wh;

    ww = window.innerWidth;
    wh = window.innerHeight;

    /**
     * Dimensions
     * @namespace
     * @description Holder for screen size numbers, set on load and reset on resize
     * @property {Number} ww - Window width
     * @property {Number} wh - Window height
     */
    this.dimensions = {
      ww: ww,
      wh: wh
    };

    /**
     * Breakpoints
     * @namespace
     * @description Holder for responsive breakpoints, set on load and reset on resize
     * @property {Boolean} small - Window width is less than 768
     * @property {Boolean} small_up - Window width is greater than 767
     * @property {Boolean} medium_portrait - Window width is between 767 and 960
     * @property {Boolean} medium - Window width is between 767 and 1025
     * @property {Boolean} large_down - Window width is less than 1024
     * @property {Boolean} large - Window width is greater than 1024
     */
    this.bp = {
      small: ww < 768,
      small_up: ww > 767,
      medium_portrait: ww > 767 && ww < 960,
      medium: ww > 767 && ww < 1025,
      large_down: ww < 1024,
      large: ww > 1024
    };
  };

  /**
   * Determine if element has class with vanilla JS
   * @param {Object} el JavaScript element
   * @param {String} cls Class name
   * @see {@link http://jaketrent.com/post/addremove-classes-raw-javascript/}
   * @return {Boolean}
   */
  FrobCoreHelpers.prototype.hasClass = function(el, cls) {
    return !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  };

  /**
   * Add class to element with vanilla JS
   * @param {Object} el JavaScript element
   * @param {String} cls Class name
   * @see {@link http://jaketrent.com/post/addremove-classes-raw-javascript/}
   */
  FrobCoreHelpers.prototype.addClass = function(el, cls) {
    if (!this.hasClass(el, cls)) {
      el.className = el.className.trim();
      el.className += ' ' + cls;
    }
  };

  /**
   * Remove class from element with vanilla JS
   * @param {Object} el JavaScript element
   * @param {String} cls Class name
   * @see {@link http://jaketrent.com/post/addremove-classes-raw-javascript/}
   */
  FrobCoreHelpers.prototype.removeClass = function(el, cls) {
    if (this.hasClass(el, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  };

  /**
   * Goes through all elements and performs function for each item
   * @private
   * @param {Array|String} selector - Array, NodeList or DOM selector
   * @param {Function} callback
   *   @param {Node} item - current looped item in callback
   */
  FrobCoreHelpers.prototype.loopAndExecute = function(selector, callback) {
    var items;

    if(selector.constructor === Array || selector.constructor === NodeList) {
      items = selector;
    } else {
      items = document.querySelectorAll(selector);
    }

    for(var i = 0; i < items.length; i++) {
      callback( items[i] );
    }
  };

  /**
   * Increase screen performance and frames per second by diasbling pointer events on scroll
   * @see {@link http://www.thecssninja.com/css/pointer-events-60fps}
   */
  FrobCoreHelpers.prototype.mobileFPS = function(){
    var scroll_timer;
    var body = document.getElementsByTagName('body')[0];

    function allowHover() {
      return this.removeClass(body, 'u-disable_hover');
    };

    function FPSScroll() {
      clearTimeout(scroll_timer),
      this.hasClass(body, 'u-disable_hover') || this.addClass(body, 'u-disable_hover'),
      scroll_timer = setTimeout(allowHover.bind(this), 500 );
    };

    this.scroll.push( FPSScroll.bind(this) );
  };

  /**
   * Fire event only once
   * @param {Function} func - Function to execute on debounced
   * @param {Integer} [threshold=250] - Delay to check if func has been executed
   * @see {@link http://unscriptable.com/2009/03/20/debouncing-javascript-methods/}
   * @example
   *   FCH.resize.push( FCH.debounce( this.resourceConsumingFunction.bind(this) ) );
   * @return {Function} Called func, either now or later
   */
  FrobCoreHelpers.prototype.debounce = function(func, threshold) {
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
  };

  return FrobCoreHelpers;

});
