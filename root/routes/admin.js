( function(){
    'use strict';
    var authentication = require('../lib/authentication');
    var mongoose = require('mongoose');
    var User = mongoose.model('User');
    var UserRoles = require('../lib/UserRoles.js');
    var _ = require('underscore');

    module.exports = function( app ){
        app.get( "/admin", authentication.protectAdmin, getAdmin );

        app.get( "/admin/users", authentication.protectAdmin, getUsers );
        app.get( "/admin/users/:userId", authentication.protectAdmin, getUser );
        app.post( "/admin/users/:userId", authentication.protectAdmin, postUser );

        app.get( "/admin/users/:userId/delete/confirm", authentication.protectAdmin, getUserConfirmDelete );
        app.post( "/admin/users/:userId/delete", authentication.protectAdmin, postUserDelete );

        app.get( "/admin/emails", authentication.protectAdmin, getEmails );
    };

    function getAdmin( req, res ){
        res.render('admin/index');
    }

    function getUsers( req, res ){
        User.find( {}, function( error, users ){
            if( error ) req.flashError( 'Error getting users: ', error );
            res.render( 'admin/users', { users: users } );
        });
    }

    function getUser( req, res ){
        User.findById( req.params.userId, function( error, user ){
            if( error ) req.flashError( 'Error getting user: ', error );

            var usersRoles = _.map( UserRoles.allRoles(), function( role ){
                return {
                    role: role,
                    hasRole: user.hasRole( role ),
                    bootstrapLabel: UserRoles.bootstrapLabelForRole( role )
                };
            });

            res.render( 'admin/user', { userToEdit: user, usersRoles: usersRoles } );
        });
    }
    
    function getUserConfirmDelete( req, res ){
        User.findById( req.params.userId, function( error, user ){
            if( error ) req.flashError( 'Error getting user: ', error );
            res.render( 'admin/confirm-user-delete', { userToDelete: user } );
        }); 
    }

    function postUserDelete( req, res ){
        User.findById( req.params.userId, function( error, user ){
            if( error ){
                req.flashError( 'Error deleting user: ', error );
                res.redirect( "/admin/users" );
                return;
            }
            
            user.remove( function( error, result ){
                if( error ){
                    req.flashError( 'Error deleting user: ', error );
                }else{
                    req.flashSuccess( 'Successfully deleted ' + user.email );
                }
                res.redirect( "/admin/users" );
            });
        });
    }
    
    function postUser( req, res ){
        User.findById( req.params.userId, function( error, user ){
            if( error ){
                req.flashError( 'Error updating user: ', error );
                res.redirect( '/admin/users/' + req.params.userId );
            }

            var roles = req.body["roles[]"];
            user.roles = roles;

            user.save( function( error, user ){
                if( error ){
                    req.flashError( "Error updating " + user.email, error );
                }else{
                    req.flashSuccess( "Successfully updated " + user.email );
                }
                res.redirect( '/admin/users/' + req.params.userId );
            });
        });
    }

    function getEmails( req, res ){
        res.render('admin/emails');
    }

})();