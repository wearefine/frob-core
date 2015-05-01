# Frob Core

Because you're not [hardcore](https://www.youtube.com/watch?v=f-mPnmfrm6I).

P.S. The inline code documentation in this pup is rock solid.

## JavaScript

1. Copy `source/javascripts/frob_core_helpers.js` and `source/javascripts/frob_core.js` to your project.
1. Apply the structure of `source/javascripts/application.js` to your project.
1. Start Frob Core (usually in `application.js`): `;(function() { FCH.ready.push(FC.init); FCH.init(); })();`

### Special Notes

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

### API

#### Breakpoints

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

#### Dimensions

Available from `FCH.dimensions`

| Accessor | Description |
|---|---|
| ww | window width |
| wh | window height |

#### Cached jQuery Objects

Only available if jQuery is included.

| Accessor | Description |
|---|---|
| `FCH.$body` | equivalent to `$('body')` |
| `FCH.$window` | equivalent to `$(window)` |

#### Hooks

Reserved functions on `FC` keys can be called automagically, avoiding declaring multiple event listeners on the `document` or `window`. For example,
use the `resize` function to change the width of `.mydiv` to match the window's width.

```javascript
FC._ui = {
  resize: function() {
    $('.mydiv').width(FCH.ww);
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

#### Default Values

Add default values for missing values in functions, similar to Ruby's `variable ||= value`

```javascript
function(required_value, missing_value) {
  missing_value = FCH.setDefault(missing_value, 10);
}
```

#### Local Storage

Read, Update, and Destroy localStorage objects.

| Function | Description |
|---|---|
| `FCH.localGet(key)` | retrieve value (returns false if key is not defined) |
| `FCH.localSet(key, value)` | create or update key |
| `FCH.localClear({optional} key)` | if key is provided, destroy just that key; otherwise destroy all keys |

#### IE

Unstable user navigation test for IE versions. Returns boolean. **For use only in trying times**

| Accessor | Description |
|---|---|
| `FCH.IE11` | true if browser is IE11 |
| `FCH.IE10` | true if browser is IE10 |
| `FCH.IE9` | true if browser is IE9 |
| `FCH.anyIE` | true if browser is Internet Explorer |

## SCSS

1. Copy `source/stylesheets` to your project (usually replacing `app/assets/stylesheets`)
