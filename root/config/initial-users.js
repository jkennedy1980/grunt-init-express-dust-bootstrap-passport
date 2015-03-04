( function(){
	'use strict';

	var UserRoles = require('../lib/UserRoles');
	
	module.exports = {
		initial_users : [
			{
				email : "admin@{%= name %}.com",
				password : "{%= admin_account_password %}",
				roles : [ UserRoles.ADMIN ]
			}
		]
	};

})();