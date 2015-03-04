( function(){
    'use strict';
    var authentication = require('../lib/authentication');

    module.exports = function( app ){
        app.get( "/admin", authentication.protectAdmin, getAdmin );
        app.get( "/admin/users", authentication.protectAdmin, getUsers );
        app.get( "/admin/emails", authentication.protectAdmin, getEmails );

    };

    function getAdmin( req, res ){
        res.render('admin/index');
    }

    function getUsers( req, res ){
        res.render('admin/users');
    }

    function getEmails( req, res ){
        res.render('admin/emails');
    }

})();