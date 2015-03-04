( function(){
	'use strict';

	var UserRoles = require('../lib/UserRoles');
	
	module.exports = {
		initial_users : [
			{
				email : "admin@{%= name %}.com",
				password : "password",
				roles : [ UserRoles.ADMIN ]
			},
			{
				email : "{%= author_email %}",
				password : "password",
				roles : []
			}
		]
	};

})();