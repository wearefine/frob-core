# Frob Core

Because you're not [hardcore](https://www.youtube.com/watch?v=f-mPnmfrm6I).

P.S. The inline code documentation in this pup is rock solid.

## Testing

We're not at automatic testing yet, but you can pull this repo down, run `$ bundle install && middleman server`, and check for any errors at `http://localhost:4567`.

## JavaScript

1. Copy `source/javascripts/frob_core_helpers.js` and `source/javascripts/frob_core.js` to your project.
1. Apply the structure of `source/javascripts/application.js` to your project.
1. Start Frob Core (usually in `application.js`): `;(function() { FCH.ready.push(FC.init); FCH.init(); })();`

Your base file (in this project it's `source/javascripts/frob_core.js`) must declare `var FC = {...}`

The subfunctions of `FC.init()` must be declared without `this`. This is to get around a `this` problem with how FC and FCH are called in `application.js`:

```javascript
var FC = {
  
  init: function() {
    FC._ui.init();
  }

};
```

Everything else, such as `FC._ui.init()`, can still use `this`.

### Breakpoints

Available from `FCH.bp`. Returns boolean.

| Accessor | Description |
|---|---|
| small | window width less than or equal to 767 |
| small_up | window width greater than or equal to 768 |
| medium_portrait | window width between 768 and 960 |
| medium | window width between 768 and 1024 |
| large | window width greater than 1024 |

```javascript
if(FCH.bp.small) {
  FCH.$body.addClass('mobile');
}
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

### Hooks

Reserved functions on `FC` keys can be called automagically, avoiding declaring multiple event listeners on the `document` or `window`. For example,
use the `resize` function to change the width of `.mydiv` to match the window's width.

```javascript
FC._ui = {
  resize: function() {
    $('.mydiv').width(FCH.dimensions.ww);
  }
};
```

Hooks can also be added by adding a function to the appropriate `FCH` hook Arrays.

```javascript
var sticky = function($el) {
  $el.css('position', 'fixed');
}
FCH.scroll.push(sticky);
```

| Hook | Called on |
|---|---|
| `scroll` | window scroll |
| `resize` | window resize |
| `ready` | DOMContentLoaded |
| `load` | window onload |

**Special Note**: Using `this` in a hook function will refer to the parent namespace.

```javascript
FC._ui = {
  boo: function() {
    alert('BOOooooOOoooOO');
  }

  resize: function() {
    this.boo();
  }
}
// a scary alert is triggered every time the window is resized
```

### Default Values

Add default values for missing values in functions, similar to Ruby's `variable ||= value`

```javascript
function(required_value, missing_value) {
  missing_value = FCH.setDefault(missing_value, 10);
}
```

### Local Storage

Read, Update, and Destroy localStorage objects.

| Function | Description |
|---|---|
| `FCH.localGet(key)` | retrieve value (returns false if key is not defined) |
| `FCH.localSet(key, value)` | create or update key |
| `FCH.localClear({optional} key)` | if key is provided, destroy just that key; otherwise destroy all keys |

### IE

Test for IE versions. Returns boolean. **Only use in the most trying of times. Agent strings are unreliable.**

| Accessor | Description |
|---|---|
| `FCH.IE11` | true if browser is IE11 |
| `FCH.IE10` | true if browser is IE10 |
| `FCH.IE9` | true if browser is IE9 |
| `FCH.anyIE` | true if browser is Internet Explorer |

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

Quick shortcut for `&:hover { ... }` accepts color or block.

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

Put a block of content within a media breakpoint using the list defined in `_breakpoints.scss`. 

```scss
.show--mobile {
  display: none;
  @include bp(small) {
    display: block;
  }
}
```

#### tp

Similar to `@include bp`, this mixin relies on `$tweakpoints`, which should be defined in your `_variables.scss`.

```scss
$tweakpoints: (
  'mbp-and-up'      : ( min-width:  1440px ),
);

@include tp(mbp-and-up) {
  content: 'This is bigger than 1440px';
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

Pass a block to apply properties to input placeholder styles. Strongly recommended to be used only at root-level.

```scss
@include placeholder {
  color: $c-gray;
  text-shadow: 1px 1px 0 $c-black;
}
```

#### ie

Target specific Internet Explorer versions, and optionally pass in a version number. **Only use this mixin as a last resort. Feature detection is strongly preferred.** 

```scss
.animated-element {
  @include ie { ... } // .ie .animated-element
  @include ie(9) { ... } // .ie9 .animated-element
}
```

#### touch

Target touch devices using [Modernizr](http://v3.modernizr.com/download/#-backgroundcliptext-canvas-canvastext-cssfilters-cssgradients-csspositionsticky-cssremunit-csstransforms-csstransforms3d-csstransitions-cssvhunit-flexbox-flexboxlegacy-flexboxtweener-inlinesvg-localstorage-picture-preserve3d-srcset-svgclippaths-svgfilters-touchevents-cssclasses-dontmin).

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
