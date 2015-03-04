( function(){
    'use strict';
    var authentication = require('../lib/authentication');

    module.exports = function( app ){
        app.get( "/admin", authentication.protectAdmin, getAdmin );
    };

    function getAdmin( req, res ){
        res.render('admin/index');
    }

})();