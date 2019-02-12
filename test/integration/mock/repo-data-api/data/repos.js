'use strict';

// Mock repositories for integration tests
module.exports = [

	// Active Origami component
	{
		name: 'o-example-active',
		type: 'module',
		subType: 'primitives',
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
		resources: {
			demos: null,
			dependencies: [
				{
					'name': 'example-dependency',
					'version': '^1.2.3',
					'source': 'bower',
					'isDev': false,
					'isOptional': false
				}
			]
		},
		markdown: {
			readme: '# o-example-active\n## test-readme\nExample content.'
		},

		// mock use only
		_versions: ['2.0.0', '1.1.1', '1.1.0', '1.0.1', '1.0.0']
	},

	// Maintained Origami component
	{
		name: 'o-example-maintained',
		type: null,
		subType: null,
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
		resources: {
			demos: null
		},

		// mock use only
		_versions: ['1.5.0', '1.4.0', '1.3.0', '1.2.0', '1.1.0', '1.0.0']
	},

	// Deprecated Origami component
	{
		name: 'o-example-deprecated',
		type: null,
		subType: null,
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
		resources: {
			demos: null
		},

		// mock use only
		_versions: ['1.0.0']
	},

	// Active non-Origami component
	{
		name: 'n-example-active',
		type: null,
		subType: null,
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
		resources: {
			demos: null
		},

		// mock use only
		_versions: ['1.2.3', '1.2.2', '1.2.1', '1.2.0', '1.1.0', '1.0.0']
	},

	// Active Origami component with demos, but no demos for the whitelabel brand
	{
		name: 'o-example-demos-except-whitelabel',
		type: null,
		subType: null,
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
		resources: {
			demos: [
				{
					'name': 'example',
					'title': 'example',
					'description': 'example',
					'brands': [
						'master',
						'internal'
					]
				}
			]
		},

		// mock use only
		_versions: ['1.5.0', '1.4.0', '1.3.0', '1.2.0', '1.1.0', '1.0.0']
	}

];
