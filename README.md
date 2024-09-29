# EvLimma

> EvLimma is a fast, small, and feature-rich JavaScript library.

For information on how to get started and how to use EvLimma, please see [EvLimma's documentation](https://codigospace.com.br/).
For source files and issues, please visit the [jQuery repo](https://github.com/evlimma/npm).

If upgrading, please see the [blog post]. This includes notable differences from the previous version and a more readable changelog.

## Including EvLimma

Below are some of the most common ways to include EvLimma.

### Browser

#### Script tag

```html
<script src="https://github.com/evlimma/npm.js"></script>
```

#### Webpack / Browserify / Babel

There are several ways to use [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/) or [Babel](https://babeljs.io/). For more information on using these tools, please refer to the corresponding project's documentation. In the script, including EvLimma will usually look like this:

```js
import "evlimma";
```

If you need to use EvLimma in a file that's not an ECMAScript module, you can use the CommonJS syntax:

```js
var evlimma = require( "evlimma" );
```

#### AMD (Asynchronous Module Definition)

AMD is a module format built for the browser. For more information, we recommend [require.js' documentation](https://requirejs.org/docs/whyamd.html).

```js
define( [ "jquery" ], function( $ ) {

} );
```

### Node

To include jQuery in [Node](https://nodejs.org/), first install with npm.

```sh
npm install evlimma
```

For EvLimma to work in Node, a window with a document is required. Since no such window exists natively in Node, one can be mocked by tools such as [jsdom](https://github.com/jsdom/jsdom). This can be useful for testing purposes.