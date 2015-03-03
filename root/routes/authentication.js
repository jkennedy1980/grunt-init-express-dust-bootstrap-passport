( function(){
	'use strict';

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var authentication = require('../lib/authentication');
	var moment = require('moment');

	var UserSchema = new Schema({
		email: { type: String, lowercase: true, trim: true, required: true, unique: true },
		passwordHash: { type: String, required: true },
		isEmailVerified: { type: Boolean, required: true, default: false },
		emailVerificationToken: { type: String },
		emailVerificationExpiry: { type: Date }
	});


	UserSchema.statics.register = function( userData, callback ){
		var User = this;
		var user = new User();
		user.email = userData.email;
		user.emailVerificationToken = _generateEmailVerificationToken();
		user.emailVerificationExpiry = moment().add( 10, 'm' ).toDate();

		authentication.hashPassword( userData.password, function( error, hashedPassword ){
			if( error ) return callback( error, false );
			user.passwordHash = hashedPassword;
			user.save( function( error, newUser ){
				if( error ){
					if( error.code === 11000 ){
						// user already exists
						return callback( new Error( "An account is already registered with this email address." ), false );
					}
					return callback( error, false );
				}
				callback( false, newUser );
			});
		});
	};

	UserSchema.statics.validateEmail = function( token, callback ){
		var User = this;
		User.findOne( { emailVerificationToken : token } ).exec( function( error, user ){
			if( error ) return callback( new Error( "Database read error" ), false );
			if( !user ) return callback( new Error( "Verification token is invalid" ), false );

			if( user.isEmailVerified ){
				return callback( false, user );
			}

			if( moment().isAfter( moment( user.emailVerificationExpiry )) ){
				return callback( new Error( "Verification email has expired" ), user );
			}

			user.isEmailVerified = true;

			user.save( callback );
		});
	};

	UserSchema.statics.restartEmailVerification = function( userData, callback ){
		var User = this;
		User.findOne( userData ).exec( function( error, user ){
			if( error ) return callback( new Error( "Database read error" ), false );
			if( !user ) return callback( new Error( "Verification email is invalid" ), false );

			if( !user.isEmailVerified ){
				user.emailVerificationToken = _generateEmailVerificationToken();
				user.emailVerificationExpiry = moment().add( 10, 'm' ).toDate();
			}

			user.save( callback );
		});

	};

	UserSchema.set( 'toJSON', {
		transform: function( doc, ret, options ){
			delete ret.passwordHash;
			return ret;
		}
	});

	UserSchema.set( 'toObject', {
		transform: function( doc, ret, options ){
			delete ret.passwordHash;
			return ret;
		}
	});

	function _generateEmailVerificationToken(){
		var TOKEN_LENGTH = 40;
		var TOKEN_CHAR_SET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var token = "";
		for( var i=0; i < TOKEN_LENGTH; i++ ){
			token += TOKEN_CHAR_SET.charAt( Math.random() * TOKEN_CHAR_SET.length );
		}
		return token;
	}

	mongoose.model( 'User', UserSchema );
})();
