( function(){
	'use strict';

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var authentication = require('../lib/authentication');

	var UserSchema = new Schema({
		email: { type: String, lowercase: true, trim: true, required: true, unique: true },
		passwordHash: { type: String, required: true }
	});
	
	UserSchema.methods.hashPasswordAndSave = function( password, callback ){
		var self = this;
		authentication.hashPassword( password, function( error, hashedPassword ){
			if( error ) return callback( error, false );
			self.passwordHash = hashedPassword;
			self.save( callback );
		});
	};
	
	UserSchema.statics.register = function( userData, callback ){
		var User = this;
		var user = new User();
		user.email = userData.email;
		user.hashPasswordAndSave( userData.password, callback );
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
	
	mongoose.model( 'User', UserSchema );
})();
