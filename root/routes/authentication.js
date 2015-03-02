( function(){
	'use strict';

	var mongoose = require('mongoose');
	var User = mongoose.model('User');
	var authentication = require('../lib/authentication');
	var emailer = require('../lib/emailer');

	module.exports = function( app ){
		app.get( "/register", getRegister );
		app.post( "/register", postRegister );

		app.get( '/login', getLogin );
		app.post( '/login', postLogin );

		app.get( '/logout', getLogout );
	};

	function getLogin( req, res ){
		res.render('authentication/login', {continueTo: req.query.continueTo });
	}

	function postLogin( req, res ){
		authentication.handleLogin( req, res );
	}

	function getLogout( req, res ){
		req.logout();
		res.redirect('/');
	}

	function getRegister( req, res ){
		res.render('authentication/register');
	}

	function postRegister( req, res ){

		//TODO: sanitize
		var email = req.body.email;
		var password = req.body.password;

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

			emailer.sendEmail( "register", { activationUrl: "blah" }, registeredUser.email, "Please activate your account", function( error, result ){
				if( error ) req.flashError( "Error sending activation email. Please try again later. ", error );
				console.log( "Sent registration email: ", result );
				req.flashSuccess( 'Registration complete. Please login.' );
				res.redirect( '/login' );
			});

		});
	}

})();