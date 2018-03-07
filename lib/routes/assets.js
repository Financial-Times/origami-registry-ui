'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const crypto = require('crypto');
const fs = require('fs');

module.exports = app => {

	const cacheFor30Days = cacheControl({
		maxAge: '30 days',
		staleWhileRevalidate: '30 days',
		staleIfError: '30 days'
	});

	function createHash(fileContents) {
		const hash = crypto.createHash('sha256');
		hash.update(fileContents);
		return hash.digest('hex');
	}

	let mainCssContent = '';
	let mainJsContent = '';
	try {
		// We can read synchronously here because this is only run in boot
		mainCssContent = fs.readFileSync(`${__dirname}/../../public/main.css`, 'utf-8');
		mainJsContent = fs.readFileSync(`${__dirname}/../../public/main.js`, 'utf-8');
	} catch (error) {
		// TODO uncomment the line below when OBT uses Pa11y 5.x
		// throw new Error('main.css or main.js could not be loaded. You need to bundle client-side assets');
	}

	app.locals.mainCssPath = `/main-${createHash(mainCssContent)}.css`;
	app.locals.mainJsPath = `/main-${createHash(mainJsContent)}.js`;

	// Serve hashed assets
	app.get(app.locals.mainCssPath, cacheFor30Days, (request, response) => {
		response.set('Content-Type', 'text/css');
		response.send(mainCssContent);
	});
	app.get(app.locals.mainJsPath, cacheFor30Days, (request, response) => {
		response.set('Content-Type', 'application/javascript');
		response.send(mainJsContent);
	});

};
