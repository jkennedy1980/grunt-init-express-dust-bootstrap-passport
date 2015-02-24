( function(){
	'use strict';

	var mongoose = require('mongoose');
	var User = mongoose.model('User');

	module.exports = function( app ){
		app.get( "/register", getRegister );
		app.post( "/register", postRegister );
		
		app.get( '/login', getLogin );
	};

	function getLogin( req, res ){
		res.render('authentication/login');
	}
	
	function getRegister( req, res ){
		res.render('authentication/register');
	}
	
	function postRegister( req, res ){
		
		//TODO: sanitize
		var email = req.param( 'email', false );
		var password = req.param( 'password', false );

		if( !email || !password ){
			req.flash( 'error', 'Email and password are required.' );
			return res.redirect( '/register' );
		}
		
		var userData = {
			email: email,
			password: password
		};
		
		User.register( userData, function( error, registeredUser ){
			if( error ) req.flashError( 'Error registering user:', error );
			if( !registeredUser ) return res.redirect( '/register' );
			req.flashSuccess( 'Registration complete. Please login.' );
			res.redirect( '/login' );
		});
	}

})();