# fcDropdown

A light-weight, native JS dropdown menu. Makes for a good alternative to stylized `<select>` menus that exist outside forms.

## Initialization

| Argument | Type | Description |
|---|---|---|
| Selector | String | Queryable DOM selector (e.g. `'.js-select'`) |
| Options | Object | Key/value hash of options (optional) |

A list of options **must be** the next sibling to the Selector (see [examples](#examples)). Don't forget to include [the required SCSS](fcdropdown.scss).

### Options

| Name | Type | Default | Description |
|---|---|---|---|
| activeClass | String | `'active'` | class applied to list item once selection is made |
| listSelector | String | `'a'` | node selector to search for in list |
| onOpen | Function | `function() {}` | callback once menu is opened |
| onSelect | Function | `function(selected) {}` | callback once selection is made; first argument is the selected list item as a Node |
| onClose | Function | `function() {}` | callback once menu is closed |

**Note:**: For all callbacks, `this` === intialization's selector node

## Examples

```html
<div class="js-select">Please choose a character</div>
<ul>
  <li>Nemo</li>
  <li>Marlin</li>
  <li>Dory</li>
</ul>

<script type="text/javascript">
new fcDropdown('.js-select', {
  listSelector: 'li',
  onSelect: function(selected) {
    alert(selected.innerText);
  }
});
</script>
```

## Applied CSS Classes

```css
.fcdropdown-selector {} /* added to the menu trigger */
.fcdropdown-destination {} /* added to options wrapper */
```
