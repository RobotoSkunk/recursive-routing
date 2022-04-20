/*!
 * recursive-routing
 * Copyright(c) 2022 Edgar Alexis Lima Mercado <contact@robotoskunk.com>
 * MIT Licensed
 */


const fs = require('fs');
const path = require('path');

const defaultOptions = {
	'rootDir': './routes',
	'basePath': '/',
	'filter': f => f.endsWith('.js'),
	'func': undefined,
	'replaceSpacesWith': '-',
	'keepExtension': false,
	'keepIndex': false,
	'debug': false
};

/**
 * Searches for all files in the given directory and subdirectories, then adds them to the given express app.
 * @type {function}
 * @param {Object} app The express app.
 * @param {Object} options The options of the function.
 */
module.exports = function (app, options = {}) {
	options = Object.assign({}, defaultOptions, options);

	if (app === undefined || app === null)
		throw new Error('The express app is undefined or null.');

	function* readDir(dir) {
		for (const dirent of fs.readdirSync(dir, { 'withFileTypes': true })) {
			const res = path.resolve(dir, dirent.name);

			if (dirent.isDirectory())
				yield* readDir(res);
			else if (dirent.isFile() && options.filter(res))
				yield res;
		}
	}

	for (const file of readDir(options.rootDir)) {
		const route = path.relative(options.rootDir, file);
		const routePath = path.join(options.basePath, route).replace(/\\/g, '/').replace(/ /g, options.replaceSpacesWith);
		const routeName = path.basename(route, path.extname(route));

		const routes = [ ];
		const isIndex = routeName.match(/^index$/i);

		if (!isIndex || (isIndex && options.keepIndex))
			routes.push(`${options.keepExtension ? routePath : routePath.replace(path.extname(routePath), '')}`);
		
		if (isIndex)
			routes.push(routePath.replace(path.basename(routePath), ''));

		const data = {
			'route': route,
			'routePath': routePath,
			'routeName': routeName,
			'fullPath': file,
			'expressRoutes': routes,
		};
		if (options.debug)
			console.log(data);

		try {
			if (options.func)
				options.func(app, data, require(file));

			app.use(routes, require(file));
		} catch (e) {
			const err = new Error(`Error while loading route ${route}`);
			err.name = 'RouteError';
			err.data = data;
			err.stack = e.stack;

			console.error(err);
		}
	}
}
