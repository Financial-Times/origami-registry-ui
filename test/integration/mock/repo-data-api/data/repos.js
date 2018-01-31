'use strict';

// Mock repositories for integration tests
module.exports = [

	// Active Origami component
	{
		name: 'o-example-active',
		version: '2.0.0',
		support: {
			status: 'active',
			email: 'origami@example.com',
			channel: {
				name: '#example-channel',
				url: 'mock-channel-url'
			},
			isOrigami: true
		},

		// mock use only
		_versions: ['2.0.0', '1.1.1', '1.1.0', '1.0.1', '1.0.0']
	},

	// Maintained Origami component
	{
		name: 'o-example-maintained',
		version: '1.5.0',
		support: {
			status: 'maintained',
			email: 'origami@example.com',
			channel: {
				name: '#example-channel',
				url: 'mock-channel-url'
			},
			isOrigami: true
		},

		// mock use only
		_versions: ['1.5.0', '1.4.0', '1.3.0', '1.2.0', '1.1.0', '1.0.0']
	},

	// Deprecated Origami component
	{
		name: 'o-example-deprecated',
		version: '1.0.0',
		support: {
			status: 'deprecated',
			email: 'origami@example.com',
			channel: {
				name: '#example-channel',
				url: 'mock-channel-url'
			},
			isOrigami: true
		},

		// mock use only
		_versions: ['1.0.0']
	},

	// Active non-Origami component
	{
		name: 'n-example-active',
		version: '1.2.3',
		support: {
			status: 'active',
			email: 'not-origami@example.com',
			channel: {
				name: '#example-channel',
				url: 'mock-channel-url'
			},
			isOrigami: false
		},

		// mock use only
		_versions: ['1.2.3', '1.2.2', '1.2.1', '1.2.0', '1.1.0', '1.0.0']
	}

];
