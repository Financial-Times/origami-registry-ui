'use strict';

const request = require('request');


module.exports = (url) => {
	return new Promise((resolve, reject) => {
		request(url, (err, response) => {
			if (err) {
				return reject(err);
			}
			resolve(response.body);
		});
	});
};
