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
		
		app.get( '/emailverification/:token', getEmailVerification );
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

		//TODO: sanitize sterlize and homongenize
		var email = req.body.email;
		var password = req.body.password;

		if( !email || !password ){
			req.flashError( 'Email and password are required.' );
			return res.redirect( '/register' );
		}

		var userData = {
			email: email,
			password: password
		};

		User.register( userData, function( error, registeredUser ){
			if( error ) return req.flashError( 'Error registering user:', error );
			
			if( !registeredUser ) return res.redirect( '/register' );

			var activationURL = req.headers.origin + "/emailverification/" + registeredUser.emailVerificationToken;
			emailer.sendEmail( "register", { activationUrl: activationURL }, registeredUser.email, "Please activate your account", function( error, result ){
				if( error ){
					req.flashError( "Error sending activation email. Please try again later. ", error );
				} else {
					console.log( "Sent registration email: ", result );
					req.flashSuccess( 'Check your email. We have sent a verification email to your account' );
				}
				res.redirect( '/login' );
			});

		});
	}

	function getEmailVerification( req, res ){
		var token = req.params.token;

		if( !token ){
			req.flashError( 'Verification link id invalid' );
			req.redirect( '/login' );
		}

		User.validateEmail( token, function( error, validatedUser ){
			if( error ){
				req.flashError( "Validation Failed. ", error );
			} else {
				console.log( "Email validation complete for email: ", validatedUser.email );
				req.flashSuccess( "Your account registration is now complete. Please login." );
			}

			res.redirect( '/login' );
		});
	}	
})();