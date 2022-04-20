# recursive-routing
Configure Express.js routes recursively using a directory structure. Very easy to configure and use.

Inspired in [express-recursive-routes](https://www.npmjs.com/package/express-recursive-routes) by [@megadix](https://github.com/megadix).

## Installation
Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm i --save recursive-routing
```

## Usage
As [@megadix](https://github.com/megadix) explained in [express-recursive-routes](https://www.npmjs.com/package/express-recursive-routes), others libraries like [express-generator](https://www.npmjs.com/package/express-generator) creates routes under a `/routes` directory, but you need to manually register every route like this:

```js
var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/users', users);
```

And it's very annoying to have to do this for every route. I mean, it literally takes a lot of time if you have a lot of routes.

## ✨ And that's why this package exists ✨
[express-recursive-routes](https://www.npmjs.com/package/express-recursive-routes) is a great library, but it doesn't allow you much freedom and customization to configure routes. And also uses deprecated features with newer versions of Node.js.

With `recursive-routing`, you can let the library do the heavy lifting for you. It will create routes recursively, and you can configure the routes with a directory structure.

Just do:

```js
const express = require('express');
const app = express();

const recursiveRouting = require('recursive-routing');

recursiveRouting(app);

app.listen(3000);
```

Then under `routes` directory, you can create a directory structure like this:

```
routes/
├── index.js
├── users/
│   ├── index.js
│   └── profile.js
```

And, by example, in `/routes/index.js`, you can create a route like this:

```js
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.send('Hello World!');
});

module.exports = router;
```

*And voila!* You have a fully configured Express.js application.

`recursive-routing` translates every directory into a route, by example, `/routes/users/profile.js` will be translated to `/users/profile`, and `/routes/users/index.js` will be translated to `/users`.

### *And what if I need to use routes with different HTTP methods?*
Well, `recursive-routing` supports it too.

```js
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.send('Hello World from GET!');
});

router.post('/', function(req, res) {
	res.send('Hello World from POST!');
});

// And also supports routes with parameters!
router.get('/:id', function(req, res) {
	res.send(`Hello World from GET with id: ${req.params.id}`);
});

module.exports = router;
```

## Configuration
`recursive-routing` exports a function that can be used to configure the routes, and the function parameters are:

```ts
recursiveRouting(app: express.Application, options?: RecursiveRoutingOptions): void
```

The configuration is done by passing an object to `recursive-routing` function.

```js
const express = require('express');
const app = express();

const recursiveRouting = require('recursive-routing');

recursiveRouting(app, {
	'rootDir': './api-routes',
	'routePrefix': '/api',
	'replaceSpacesWith': '_'
});

app.listen(3000);
```

The options of `recursive-routing` are:

| Option              | Type                                                | Default                                                      | Description                                                                  |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `rootDir`           | string                                              | `'./routes'`                                                 | The root directory of routes.                                                |
| `basePath`          | string                                              | `'/'`                                                        | The base path of routes.                                                     |
| `filter`            | function(string)                                    | `f => f.endsWith('.js')`                                     | A function that returns `true` if the file should be included in the routes. |
| `mountFunction`     | function(express.Application, data, express.Router) | `(app, data, router) => app.use(data.expressRoutes, router)` | A function that mounts the routes. |
| `replaceSpacesWith` | string                                              | `'-'`                                                        | The string that will be used to replace spaces in the route path.            |
| `keepExtension`     | boolean                                             | `false`                                                      | If `true`, the extension of the file will be kept.                           |
| `keepIndex`         | boolean                                             | `false`                                                      | If `true`, the `index.js` file will be kept as `/index` too.                 |
| `debug`             | boolean	                                            | `false`                                                      | If `true`, the debug messages will be printed.                               |

In the `mountFunction` function, there's a parameter `data` that contains the data of the route. It's an object with the following properties:

| Name            | Type     | Description                              |
| --------------- | -------- | ---------------------------------------- |
| `route`         | string   | The path of the found file.              |
| `routePath`     | string   | The path of the file with the base path. |
| `routeName`     | string   | The name of the file without extension.  |
| `fullPath`      | string   | The full path of the file.               |
| `expressRoutes` | string[] | The array of Express.js routes.          |

And that data will be printed to the console if `debug` is `true`.

### Examples

#### Simple routing
```js
const express = require('express');
const app = express();

recursiveRouting(app, {
	'rootDir': './api-routes',
	'routePrefix': '/api',
	'replaceSpacesWith': '_'
});

app.listen(3000);
```

#### Website routing with REST API
```js
const express = require('express');
const app = express();

recursiveRouting(app, {
	'rootDir': './api-routes',
	'routePrefix': '/api',
	'filter': f => f.endsWith('.js') || f.endsWith('.ts'),,
	'mountFunction': (app, data, router) => {
		console.log(data);

		for (var i in data.expressRoutes) {
			data.expressRoutes[i] = data.expressRoutes[i].replace(/^\/api/, '');
		}

		app.use(data.expressRoutes, router);
	}
});

recursiveRouting(app, {
	'rootDir': './website'
});

app.listen(443);
```

#### La macarena
```js
const ejs = require('ejs');

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/sing-a-song/', (req, res) => {
	res.render('sing-a-song', {
		'name': 'La macarena'
	});
});

recursiveRouting(app, {
	'rootDir': './views',
	'routePrefix': '/views'
});

app.listen(443);
```

## Contributing
This project is open-source and you can contribute to it by opening an issue or creating a pull request.

## License
This project is licensed under the [MIT license](LICENSE).

