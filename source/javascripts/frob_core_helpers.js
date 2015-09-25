/*globals FC */

'use strict';

/**
 * Frob core helpers
 * @namespace
 */
var FCH = {

  /* Listener Arrays */
  /** @type {Array.<function>} */
  resize: [],
  /** @type {Array.<function>} */
  scroll: [],
  /** @type {Array.<function>} */
  ready: [],
  /** @type {Array.<function>} */
  load: [],

  /**
   * @description Start everything up
   */
  init: function() {

    // IE detection
    this.IE10 = this.isIE(10);
    this.IE9 = this.isIE(9);
    this.anyIE = (this.IE10 || this.IE9);

    this.breakpoints();

    this.resize.push(this.breakpoints);
    this.ready.push(this.mobileFPS);

    var listeners = ['resize', 'scroll', 'ready', 'load'];
    for(var i = 0; i < listeners.length; i++) {
      this._attachChildListeners( listeners[i] );
    }

    this._attachListeners();
  },

  /**
   * @description Apply value to variable if it has none
   * @param {var} variable - variable to set default to
   * @param {*} value - default value to attribute to variable
   * @return {*} Existing value or passed value argument
   */
  setDefault: function(variable, value){
    return (typeof variable === 'undefined') ? value : variable;
  },

  /**
   * @description Nice, unjanky scroll to element
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
      $('html,body').animate({
        scrollTop: $target.offset().top + offset
      }, duration);
    }, delay);
  },

  /**
   * @description Store a string locally
   * @param {String} key - Accessible identifier
   * @param {String} obj - Value of identifier
   * @return {String} Value of key in localStorage
   */
  localSet: function(key, obj) {
    var value = JSON.stringify(obj);
    localStorage[key] = JSON.stringify(obj);

    return value;
  },

  /**
   * @description Retrieve localstorage object value
   * @param {String} key - Accessible identifier
   * @return {String|Boolean} Value of localStorage object or false if key is undefined
   */
  localGet: function(key) {
    if (typeof localStorage[key] !== 'undefined') {
      return JSON.parse(localStorage[key]);
    } else {
      return false;
    }
  },

  /**
   * @description Clear value of localstorage object. If no key is passed, clear all objects
   * @param {String} [key] - Accessible identifier
   * @return {Undefined} Result of clear or removeItem action
   */
  localClear: function(key){
    return typeof key === 'undefined' ? localStorage.clear() : localStorage.removeItem(key);
  },

  /**
   * @description Check if IE is current browser
   * @param {Number|String} version
   * @return {Boolean}
   */
  isIE: function(version) {
    var regex = new RegExp('msie' + (!isNaN(version)?('\\s' + version) : ''), 'i');
    return regex.test(navigator.userAgent);
  },

  /**
   * @description Check for existence of element on page
   * @param {String} query - JavaScript object
   * @return {Boolean}
   */
  exists: function(query) {
    return !!document.querySelector(query);
  },

  /**
   * @description Provides accessible booleans for fluctuating screensizes
   */
  breakpoints: function() {
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
    FCH.dimensions = {
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
     * @property {Boolean} large - Window width is greater than 1024
     */
    FCH.bp = {
      small: ww < 768,
      small_up: ww > 767,
      medium_portrait: ww > 767 && ww < 960,
      medium: ww > 767 && ww < 1025,
      large: ww > 1024
    };
  },

  /**
   * @description Determine if element has class with vanilla JS
   * @param {Object} el JavaScript element
   * @param {String} cls Class name
   * @see {@link http://jaketrent.com/post/addremove-classes-raw-javascript/}
   * @return {Boolean}
   */
  hasClass: function(el, cls) {
    return !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },

  /**
   * @description Add class to element with vanilla JS
   * @param {Object} el JavaScript element
   * @param {String} cls Class name
   * @see {@link http://jaketrent.com/post/addremove-classes-raw-javascript/}
   */
  addClass: function(el, cls) {
    if (!this.hasClass(el, cls)) {
      el.className = el.className.trim();
      el.className += ' ' + cls;
    }
  },

  /**
   * @description Remove class from element with vanilla JS
   * @param {Object} el JavaScript element
   * @param {String} cls Class name
   * @see {@link http://jaketrent.com/post/addremove-classes-raw-javascript/}
   */
  removeClass: function(el, cls) {
    if (this.hasClass(el, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  },

  /**
   * @description Increase screen performance and frames per second by diasbling pointer events on scroll
   * @see {@link http://www.thecssninja.com/css/pointer-events-60fps}
   */
  mobileFPS: function(){
    var scroll_timer,
        body = document.getElementsByTagName('body')[0],
        _this = FCH,
        allowHover = function() {
          return _this.removeClass(body, 'u-disable_hover');
        };

    var FPSScroll = function() {
      clearTimeout(scroll_timer),
      _this.hasClass(body, 'u-disable_hover') || _this.addClass(body, 'u-disable_hover'),
      scroll_timer = setTimeout(allowHover, 500 );
    };

    _this.scroll.push(FPSScroll);
  },


  /**
   * @protected
   * @description Attach hooks on child objects to the listener arrays
   * @param {String} listener - Such as 'resize' or 'load'
   */
  _attachChildListeners: function(listener) {
    var kids = Object.keys(FC);

    for(var i = 0; i < kids.length; i++) {
      var child = FC[kids[i]];
      if( child.hasOwnProperty(listener) ) {
        var child_func = child[listener];
        child_func.prototype = child;
        FCH[listener].push( child_func );
      }
    }
  },

  /**
   * @protected
   * @description Execute listeners using the bundled arrays
   * @param {String} listener - What to hear for, i.e. scroll, resize
   */
  _callListener: function(listener) {
    var listener_array = this[listener];

    for(var x = 0; x < listener_array.length; x++) {
      listener_array[x].call( listener_array[x].prototype );
    }

  },

  /**
   * @protected
   * @description Fire events more efficiently
   * @param {String} type - Listener function to trump
   * @param {String} name - New name for listener
   * @param {Object} obj - Object to bind/watch (defaults to window)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Events/scroll}
   */
  _throttle: function(type, name, obj) {
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
  },

  /**
   * @protected
   * @description Actually bind the listeners to objects
   */
  _attachListeners: function() {
    var _this = this;
    var listener = 'optimized';

    // Optimized fires a more effective listener but the method isn't supported in all browsers
    if(typeof CustomEvent === 'function') {
      _this._throttle('resize', 'optimizedresize');
      _this._throttle('scroll', 'optimizedscroll');
    } else {
      listener = '';
    }

    window.addEventListener(listener + 'scroll', function() {
      _this._callListener('scroll');
    });
    window.addEventListener(listener + 'resize', function() {
      _this._callListener('resize');
    });
    document.addEventListener('DOMContentLoaded', function() {
      _this._callListener('ready');
    });
    window.addEventListener('load', function() {
      _this._callListener('load');
    });
  },

};

/* Cached jQuery variables */
if(typeof jQuery !== 'undefined') {
  /** @type {jQuery} */
  FCH.$body = jQuery('body');
  /** @type {jQuery} */
  FCH.$window = jQuery(window);
  /** @type {jQuery} */
  FCH.$document = jQuery(document);
}
