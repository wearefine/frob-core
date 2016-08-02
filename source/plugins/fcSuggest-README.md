# fcSuggest

A light-weight, native JS live-search menu.

## Initialization

| Argument | Type | Description |
|---|---|---|
| Selector | String | Queryable DOM **input** selector (e.g. `'.js-filter-input'`) |
| Options | Object | Key/value hash of options (optional) |

A list of options **must be** the next sibling to the Selector (see [examples](#examples)). Don't forget to include [the required SCSS](fcsuggest.scss).

### Options

| Name | Type | Default | Description |
|---|---|---|---|
| displayClass | String | `'shown'` | class applied to list items that match searched criteria |
| activeClass | String | `'active'` | class applied to first item or selected list item |
| listSelector | String | `'li'` | node selector to search for in list |
| onSelect | Function | `function() {}` | callback once selection is made; `this` === selected node |

## Examples

```html
<input type="text" class="js-filter-input" placeholder="Please />
<ul>
  <li data-loc="nemo.html">Nemo</li>
  <li data-loc="marlin.html">Marlin</li>
  <li data-loc="dory.html">Dory</li>
</ul>

<script type="text/javascript">
new fcSuggest('.js-filter-input', {
  onSelect: function() {
    window.location = this.getAttribute('data-loc');
  }
});
</script>
```

## Applied CSS Classes

```css
.fcsuggest {} /* wrapper */
.fcsuggest-suggestor {} /* hint behind text input */
.fcsuggest-active /* applied to wrapper when input is focused; removed when input blurs */
```
