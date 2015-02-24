( function(){
	
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var mongoose = require('mongoose');
	var bcrypt = require('bcrypt');

	var PASSWORD_HASH_ITERATIONS = 16; // Needs to increase as hardware becomes faster
	
	exports.init = function( app ){
		var User = mongoose.model('User');

		passport.use( new LocalStrategy(
			function( email, password, done ){
				User.findOne({ email: email }, function( error, user ){
					if( error ) return done( error );
					if( !user ) return done( null, false, { message: 'Incorrect username.' } );
					if( !user.validPassword( password ) ) return done( null, false, { message: 'Incorrect password.' } );
					return done( null, user );
				});
			}
		));

		passport.serializeUser( function( user, done ){
			done( null, user.id );
		});

		passport.deserializeUser( function( id, done ){
			User.findById( id, function( error, user ){
				done( error, user );
			});
		});

		app.use( passport.initialize() );
		app.use( passport.session() );
	};
	
	exports.hashPassword = function( password, callback ){
		bcrypt.genSalt( PASSWORD_HASH_ITERATIONS, function( error, salt ){
			if( error ) return callback( error, false );
			bcrypt.hash( password, salt, callback );
		});
	};

	exports.passwordMatchesHash = function( candidatePassword, passwordHash, callback ){
		bcrypt.compare( candidatePassword, passwordHash, function( error, isMatch ){
			if( error ) return callback( error );
			callback( false, isMatch );
		});
	};
	
})();