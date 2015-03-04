( function(){
	'use strict';
	
	var config = require('pony-config');
	var mongoose = require('mongoose');
	var async = require('async');
	var authentication = require('./authentication');

	exports.setupInitialUsers = function( callback ){

		var initialUsers = config.get('initial_users');

		if( initialUsers && initialUsers.length ){
			async.each( initialUsers, _insertInitialUserWithData, callback );
		} else {
			callback( false );
		}
	};

	function _insertInitialUserWithData( userData, callback ){

		var User = mongoose.model('User');

		User.findOne( { email: userData.email } ).exec( function( error, user ){
			if( error ) return callback( error );
			if( user ) return callback( false );

			authentication.hashPassword( userData.password, function( error, passwordHash ){
				var user = new User();
				user.email = userData.email;
				user.passwordHash = passwordHash;
				user.roles = userData.roles;
				user.isEmailVerified = true;

				user.save( callback );
			});
		});
	}

})();