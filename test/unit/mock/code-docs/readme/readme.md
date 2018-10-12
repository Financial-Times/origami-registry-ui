# o-test-component [![CircleCI](https://circleci.com/gh/Financial-Times/o-test-component.png?style=shield&circle-token=8d39afee1e3c3b1f586770034db9673b791cb4f8)](https://circleci.com/gh/Financial-Times/o-test-component)

FT-branded styles for test elements.

- [Usage](#usage)
	- [Markup](#markup)
	- [Sass](#sass)
	- [JavaScript](#javascript)
- [Troubleshooting](#troubleshooting)
- [Migration guide](#migration-guide)
- [Contact](#contact)
- [Licence](#licence)


## Usage

### Markup

Add content to `o-test-component`:

```html
<div class="o-test-component" data-o-component="o-test-component">
    <!-- My content -->
</div>
```

For an example see the [registry demos](https://www.ft.com/__origami/service/build/v2/demos/o-test-component/).

### Sass

#### Silent mode

In silent mode `o-test-component` provides mixins for each part of the test component.

The `oTestComponent` mixin will output all features of `o-test-component`. Turn off silent mode to output all `o-test-component` features using this mixin automatically.

```   sass
$o-test-component-is-silent: false;
@import 'o-test-component/main';
```

#### Mixins

If your project does not need all `o-test-component` features, you may reduce your project's CSS bundle size by using the following mixins to only output what you need.

### JavaScript

`o-test-component` provides some JavaScript to make things even better.

## Troubleshooting:

* Turn it off and on again?

----

## Migration Guide

## Upgrading from v1.x.x to v2.x.x

```diff
-<div class="o-test-component-original">
+<div class="o-test-component">
```

## Contact

If you have any questions or comments about this component, or need help using it, please either [raise an issue](https://github.com/Financial-Times/o-test-component/issues), visit [#ft-origami](https://financialtimes.slack.com/messages/ft-origami/) or email [Origami Support](mailto:origami-support@ft.com).

## Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

[bem]: http://getbem.com/naming/
