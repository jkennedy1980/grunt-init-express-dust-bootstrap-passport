/*
 * grunt-init-express-dust-bootstrap-passport
 *
 * Copyright (c) 2014 Joshua Kennedy
 * Licensed under the MIT license.
 */

'use strict';

exports.description = 'Scaffold Node.JS, Express, Mocha, Eslint, Dust, Bootstrap, Passport';

// Template-specific notes to be displayed before question prompts.
exports.notes = '_Project name_ shouldn\'t contain "node" or "js" and should ' +
	'be a unique ID not already in use at search.npmjs.org.';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
	'install_. After that, run _grunt prepare_, and/or _grunt start_ ';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function( grunt, init, done ){

	init.process( {type: 'node'}, [
		// Prompt for these values.
		init.prompt('name'),
		init.prompt('description'),
		init.prompt('version'),
		init.prompt('repository'),
		init.prompt('homepage'),
		init.prompt('bugs'),
		init.prompt('licenses'),
		init.prompt('author_name'),
		init.prompt('author_email'),
		init.prompt('author_url'),
		init.prompt('admin_account_password', _randomPassword() ),
		init.prompt('node_version', '>= 0.10.0'),
		init.prompt('client_js_module_name', 'COOLAPP' ),
		init.prompt('mongo_db_name', 'CoolDB' )

	], function( err, props ){

		var files = init.filesToCopy( props );

		props.main = "app/app.js",

		props.scripts = {
			"start": "node app/app.js",
			"sup": "supervisor -e js,json,html app/app.js"
		};

		props.dependencies = {
			"express": "~4.11.1",
			"debug": "~2.1.1",
			"lodash": "^3.3.1",
			"request": "~2.51.0",
			"async": "~0.9.0",
			"connect-flash": "~0.1.1",
			"serve-favicon": "~2.2.0",
			"colors": "~1.0.3",
			"morgan": "~1.5.1",
			"cookie-parser": "~1.3.3",
			"body-parser": "~1.10.2",
			"express-session": "~1.10.1",
			"dustjs-linkedin": "~2.5.1",
			"dustjs-helpers": "~1.5.0",
			"consolidate": "~0.10.0",
            "moment": "~2.9.0",
            "lusca": "~1.0.2",
            "pony-config": "~1.0.0",
			"mongoose": "~3.8.21",
			"connect-mongo": "~0.6.0",
			"passport": "~0.2.1",
			"passport-local": "~1.0.0",
			"bcrypt": "~0.8.1",
			"nodemailer": "~1.3.1",
			"nodemailer-smtp-pool": "~1.0.0",
			"email-templates": "~1.2.0",
			"less": "~1.7.5"
		};

		props.devDependencies = {
			"grunt": "~0.4.5",
			"load-grunt-tasks": "~3.0.0",
			"grunt-contrib-watch": "~0.6.1",
			"grunt-contrib-less": "~1.0.0",
			"grunt-contrib-uglify": "~0.7.0",
			"grunt-contrib-csslint": "~0.4.0",
			"grunt-contrib-cssmin": "~0.11.0",
			"grunt-eslint": "~4.0.0",
			"grunt-simple-mocha": "~0.4.0",
			"mocha": "~2.1.0",
			"grunt-open": "~0.2.3",
			"grunt-retire": "~0.3.7",
			"grunt-supervisor": "~0.2.4"
		};

		// Add properly-named license files.
		init.addLicenseFiles( files, props.licenses );

		// Actually copy (and process) files.
		init.copyAndProcess( files, props, { noProcess: ['public/fonts/**', 'public/images/**']} );

		// Generate package.json file.
		init.writePackageJSON( 'package.json', props );

		done();

	});

	function _randomPassword(){
		var source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY01234567890@#$%^&*";
		var password = "";
		for( var i=0; i < 8; i++ ){
			password += source.charAt( Math.random() * source.length );
		}
		return password;
	}
};
