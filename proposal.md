# v2 API Proposal 

tl;dr i want to redo the FCH API

## Why Our Current API Needs to be Replaced

**Our current hooks:**

```javascript
FC.whatever = {
  ready: function() {

  },

  resize: function() {

  },

  load: function() {

  }
}
```

While readable, this isn't necessarily best practice. It doesn't allow us to remove listeners, and it allows logic to be placed outside relevant functions. It also encourages poor performance habits:

```javascript
FC.whatever = {
  resize: function() {
    // Wrong - Conditional called every time, even if `.selector` is always present on load for this page. 
    if(FCH.exists('.selector')) {
      this.resizeFunc();
    }
  },

  ready: function() {
    // Right - Conditional called once
    if(FCH.exists('.selector')) {
      FCH.resize.push( this.resizeFunc );
    }
  }
}
```

By using the `FC` namespace, we're also forced to make a separate `var FC = {}` declaration and often put it in its own file.

## The New API

Since we've been wrapping all our JS in IIFE's lately, I'd like to build on that with a cleaner syntax that disregards the hooks as separate objects.

```javascript
(function() {
  function myFancyResizeFunction() {

  }

  // Instead of `push`, an add function will be produced to allow removal of listeners later with something like `remove`
  FCH.resize.add( myFancyResizeFunction );
  FCH.ready.add( allMyListeners );
})();
```

This way, code is limited to the functions they're called in, and we won't be as reliant on `this` to reference FC children. `FC` will also be eliminated, only `FCH` will exist.
