# Frob Core

[![Build Status](https://travis-ci.org/wearefine/frob-core.svg?branch=master)](https://travis-ci.org/wearefine/frob-core) [![Code Climate](https://codeclimate.com/github/wearefine/frob-core/badges/gpa.svg)](https://codeclimate.com/github/wearefine/frob-core)

Because you're not [hardcore](https://www.youtube.com/watch?v=f-mPnmfrm6I).

## JavaScript

1. Copy `source/javascripts/frob_core_helpers.js` and `source/javascripts/frob_core.js` to your project.
1. Apply the structure of `source/javascripts/application.js` to your project.

### Initialization and Options

In v2, a core holder is unnecessary. Just make some IIFEs and hang loose.

```javascript
(function() {
  'use strict';

  function initSlider() {
    if(FCH.exists('.js-slider')) {
      this.mySuperSliderInitialization();
    }
  }

  FCH.ready.add( initSlider );
})();
```

### Hooks

| Hook | Called on |
|---|---|
| `scroll` | window scroll |
| `resize` | window resize |
| `ready` | DOMContentLoaded |
| `load` | window onload |

Hooks are events that are called automagically, avoiding declaring multiple event listeners on the `document` or `window`. 

They can be easily added and removed.

```javascript

function boo() {
  alert('BOOooooOOoooOO')
}

FCH.resize.add( boo );
// a scary alert is triggered every time the window is resized

FCH.resize.remove( boo );
// you will no longer be scared
```

#### Debounced Events

Sometimes, a callback function on rapid-firing window events can be resource-intensive. Thanks to pioneering efforts from [John Hann](http://unscriptable.com/2009/03/20/debouncing-javascript-methods/), [Paul Irish](http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/), and [Underscore.js](https://github.com/jashkenas/underscore/blob/master/underscore.js#L853), these events can be tricked to fire only once or twice instead of continuously.

Wrap your function in `FCH.debounce` when adding it to a hook.

```javascript
function resourceConsumingFunction() { ... }

FCH.resize.add( FCH.debounce( resourceConsumingFunction ) );
```

| Param | Description |
|---|---|
| `func` | Callback function |
| `threshold` | Milliseconds to check between fires (defaults to 250) |

### Breakpoints

These defaults are available from `FCH.bp`. Returns boolean. They can be appended, overwritten, or removed entirely when declaring options.

| Accessor | Description |
|---|---|
| small | window width less than or equal to 767 |
| small_up | window width greater than or equal to 768 |
| medium_portrait | window width between 768 and 960 |
| medium | window width between 768 and 1024 |
| large_down | window width less than 1024 |
| large | window width greater than 1024 |

```javascript
if(FCH.bp.small) {
  FCH.$body.addClass('mobile');
}
```

#### `.setBreakpoints()`

| Argument | Description |
|---|---|
| `breakpoints` | Function with boolean values to add to `FCH.bp` |
| `override_breakpoints` | if `FCH.bp` should be completely replaced with this function (leave blank to merge with defaults `FCH.bp` values) |

```javascript
FCH.setBreakpoints(function(ww) {
    return {
      boot_size: ww < 12
    }
  },
  true
});

// FCH.bp => { boot_size: <true|false> }
```

### Dimensions

Available from `FCH.dimensions`

| Accessor | Description |
|---|---|
| ww | window width |
| wh | window height |

### Cached jQuery Objects

Only available if jQuery is included.

| Accessor | Description |
|---|---|
| `FCH.$body` | equivalent to `$('body')` |
| `FCH.$window` | equivalent to `$(window)` |

### Default Values

Add default values for missing values in functions, similar to Ruby's `variable ||= value`

```javascript
function(required_value, missing_value) {
  missing_value = FCH.setDefault(missing_value, 10);
}
```

### Loops

`loop` saves characters on `for` loops.

| Param | Description |
|---|---|
| `selector` | Array, NodeList or DOM selector |
| `callback` | requires one argument - the current looped item in callback |

```javascript
var titles = '';
FCH.loop('.posts', function(post) {
  titles += post.querySelector('h2').textContent;
});
```

### Local Storage

Read, Update, and Destroy localStorage objects.

| Function | Description |
|---|---|
| `FCH.localGet(key)` | retrieve value (returns false if key is not defined) |
| `FCH.localSet(key, value)` | create or update key |
| `FCH.localClear({optional} key)` | if key is provided, destroy just that key; otherwise destroy all keys |

### Existence

Check to see if an element exists on the page

```javascript
// <div class="henry"></div>

FCH.exists('.henry') // => true
```

## SCSS

1. Copy `source/stylesheets` to your project (usually replacing `app/assets/stylesheets`)

### Variables

| Variable | Description |
|---|---|
| `$em-base` | font-size (must be in pixels) used for `emCalc` and `remCalc`. |
| `$f-sans` | font stack for sans-serif fonts |
| `$f-serif` | font stack for serif fonts |
| `$f-script` | font stack for script fonts |
| `$f-monospace` | font stack for monospaced fonts |
| `$f-international` | font fallback stack for multilingual fonts |
| `$c-white` | vanilla palette for `#fff` |
| `$c-black` | vanilla palette for `#000` |

Font-stack variables are designed to be applied after custom font names.

```scss
$f-opensans: 'Open Sans', $f-sans;
$f-content: $f-opensans;
```

### Mixins

#### hover

Quick shortcut for `&:hover { ... }`. Accepts color value or block.

```scss
@include hover($c-white)

@include hover {
  background: $c-white;
}
```

#### stack

Make `z-index`ing easy. Create an ordered list of your classes and call it inside your class.

```scss
$lightbox: (
  'lightbox-bg',
  'lightbox-content'
);

.lightbox {
  &-bg {
    @include stack($lightbox); // z-index: 1
  }
  &-content {
    @include stack($lightbox); // z-index: 2
  }
}
```

If you want to name your ordered list different from your classes, pass a key as the second argument.

```scss
.lightbox {
  &-bg {
    @include stack($lightbox, 'lightbox-content'); // z-index: 2
  }
  &-content {
    @include stack($lightbox, 'lightbox-bg'); // z-index: 1
  }
}
```

#### bp


| Param | Accepts | Default |
|---|---|---|
| `$name` | string | required |
| `$breakpoint_list` | map | `$breakpoints` |
| `$additional_breakpoints` | arglist<string> | `null` |

Put a block of content within a media breakpoint using the `$breakpoints` list defined in `_variables.scss`.

```scss
.show--mobile {
  display: none;
  @include bp(small) {
    display: block;
  }
}
```

To use a custom set of breakpoints, pass the list in the second argument (default is `$breakpoints`).

```scss
$tweakpoints: (
  'really-specific-nav-size': ( min-width: 438px )
);
@include bp(really-specific-nav-size, $tweakpoints) { ... }
```

Multiple breakpoints can be combined with an [arglist](https://www.sitepoint.com/sass-multiple-arguments-lists-or-arglist/) starting at the third argument. *Note that proper order should be obeyed and will not be automatically corrected (i.e. including `print` or `screen` as the third argument).*

```scss
.narrow-print {
  // Prints `@media only print and (min-width: 421px) and (max-width: 767px)`
  @include bp(print, $breakpoints, small, medium-down) { ... }
}
```

#### triangle

Apply a CSS triangle to an element.

| Param | Accepts | Default |
|---|---|---|
| `$direction` | top, bottom, left, right | top |
| `$color` | hex | `$c-black` |
| `$size` | px | `30px` |
| `$shadow` | boolean | `false` |

```scss
.nav-dropdown {
  @include triangle(bottom, $c-white);
}
```

#### placeholder

Pass a block to apply properties to input placeholder styles. Strongly recommended to be used only at root-level. Accepts block.

```scss
@include placeholder {
  color: $c-gray;
  text-shadow: 1px 1px 0 $c-black;
}
```

#### ie

Target specific Internet Explorer versions, and optionally pass in a version number. **Only use this mixin as a last resort. Feature detection is strongly preferred.** Accepts block.

```scss
.animated-element {
  @include ie { ... } // .ie .animated-element
  @include ie(9) { ... } // .ie9 .animated-element
}
```

#### touch

Target touch devices using [Modernizr](http://v3.modernizr.com/download/#-backgroundcliptext-canvas-canvastext-cssfilters-cssgradients-csspositionsticky-cssremunit-csstransforms-csstransforms3d-csstransitions-cssvhunit-flexbox-flexboxlegacy-flexboxtweener-inlinesvg-localstorage-picture-preserve3d-srcset-svgclippaths-svgfilters-touchevents-cssclasses-dontmin). Accepts block.

```scss
.nav {
  @include touch { ... } // .touch .nav
}
```

#### clearfix

Use a [Nicolas Gallagher](http://nicolasgallagher.com/micro-clearfix-hack/) clearfix. A `.clearfix` class is available in `_utilities.scss`

```scss
.cf {
  @include clearfix;
}
```

#### vertical-center

[Vertically align](http://zerosixthree.se/vertical-align-anything-with-just-3-lines-of-css/) an object without `vertical-align`.

```scss
.center-between {
  @include vertical-center;
}
```

### Functions

#### emCalc

Convert `px` to `em`. Relies on `$em-base` in `_fine_variables.scss`, but this can be overwritten in your own `_variables.scss`

```scss
body {
  font-size: emCalc(16px);
}
```

#### remCalc

Convert `px` to `rem`. Relies on `$em-base` in `_fine_variables.scss`, but this can be overwritten in your own `_variables.scss`

```scss
body {
  font-size: remCalc(16px);
}
```

#### match

Find pair of value or key in map. If value/key cannot be found, returns false

```scss
$descriptions: (
  'big' : 'blue',
  'wet' : 'wide'
);

.whats-the-sea-like {
  &:before {
    background: match($descriptions, 'big'); // 'blue'
    content: match($descriptions, 'wet'); // 'wide'
  }
}
```

#### negate

Invert a number.

```scss
.upside-down {
  top: negate(10px);
}
```

#### gray

Use a gray color from the `$grays` map.

```scss
$grays: (
  30: #777
);

a {
  color: gray(30); // #777
}
```

## File Structure and Naming Conventions

### JavaScript

Child files should have declarations in the following order:

1. Scoped variables
1. FCH hooks
1. Public functions
1. Protected functions

Example:

```javascript

FC.ui = {
  logo_height: 100,

  ready: function() {
    this.setLogoHeight();
  },

  load: function() {
    this.setLogoHeight();
  },

  resize: function() {
    this.setLogoHeight();
  },

  setLogoHeight: function() {
    var logo = this._getLogo();
    this.logo_height = logo.innerHeight;
  },

  _getLogo: function() {
    return document.querySelector('.logo');
  }
}
```

Functions should be lowerCamelCase; variables should be lower_underscore. All functions must include a short description and should be documented using [JSDoc](http://usejsdoc.org/) standards.

```javascript
/**
 * Update value of scoped `logo_height` var
 * @fires _getLogo
 */
setLogoHeight: function() { ... },

/**
 * Find the logo element
 * @protected
 * @return {Node}
 */
_getLogo: function() { ... }
```

## Testing

Install all dependencies:

```bash
npm install --save-dev
```

* `npm test` provides a quick, one-run test as defined in [test/karma.conf.js](test/karma.conf.js)
* `npm run test:dev` opens a Karma instance that watches for file changes, as defined in [test/karma.conf.js](test/local.karma.conf.js)
