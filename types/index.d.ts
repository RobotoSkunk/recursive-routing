/// <reference types="express" />
import * as express from 'express';

/**
 * Searches for all files in the given directory and subdirectories, then adds them to the given express app.
 * @param app The express app.
 * @param options The options of the function.
 */
declare function recursiveRouting(app: express.Application, options?: recursiveRouting.RecursiveRoutingOptions): void;

declare namespace recursiveRouting {
	interface RouteData {
		/**
		 * The path of the file.
		 */
		route: string;

		/**
		 * The path of the file with the base path.
		 */
		routePath: string;

		/**
		 * The name of the file without extension.
		 */
		routeName: string;

		/**
		 * Tue full path of the file.
		 */
		fullpath: string;

		/**
		 * The array of Express.js routes.
		 */
		expressRoutes: string[];
	}

	interface RecursiveRoutingOptions {
		/**
		 * The base path to read routes from.
		 * @default './routes'
		 */
		rootDir: string;
	
		/**
		 * The base path to routing with express.
		 * @default '/'
		 */
		basePath: string;
	
		/**
		 * A function that returns a boolean indicating whether the file should be included in the routing.
		 * @default (file) => file.endsWith('.ts')
		 */
		filter: (file: string) => boolean;
	
		/**
		 * A custom function to process the route data.
		 * @default undefined
		 */
		func: (app: Object, data: RouteData, route: Object) => void;
	
		/**
		 * A string which replaces the route spaces with your chosen delimiter.
		 * @default '-'
		 */
		replaceSpacesWith: string;
	
		/**
		 * When true, the files extensions will be added to the route name.
		 * @default false
		 */
		keepExtension: boolean;
	
		/**
		 * When true, the index route name will be added to the route path.
		 * @default false
		 */
		keepIndex: boolean;
	
		/**
		 * When true, an output log will be printed to the console.
		 * @default false
		 */
		debug: boolean;
	}	
}

export = recursiveRouting;
