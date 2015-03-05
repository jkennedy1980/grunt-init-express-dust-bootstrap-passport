var {%= client_js_module_name %} = (function( app ){
    'use strict';

    app.password = app.password || {};

    app.password.minimumPasswordStrength = 50;
    app.password.bestPasswordStrength = 70;

    app.password.passwordIsSecureEnough = function( password ){
        var strength = exports.getPasswordStrength( password );
        return ( strength >= exports.minimumPasswordStrength );
    };

    app.password.getPasswordStrength = function( password ){
        if( !(typeof password == 'string' || password instanceof String) ) return 0;

        var longPasswordLength = 15;

        var lengthRank = password.length;
        if( lengthRank < 6 ) lengthRank = 0;
        if( lengthRank > 6) lengthRank = 5;

        var noNumbers = password.replace( /[0-9]/g, "" );
        var numbersRank = (password.length - noNumbers.length);
        if( numbersRank > 3) numbersRank = 3;

        var noSpecialChars = password.replace( /\W/g, "" );
        var specialCharsRank = (password.length - noSpecialChars.length);
        if( specialCharsRank > 3 ) specialCharsRank = 3;

        var noUppercaseLetters = password.replace( /[A-Z]/g, "" );
        var uppercaseLettersRank = (password.length - noUppercaseLetters.length);
        if( uppercaseLettersRank > 3 ) uppercaseLettersRank = 3;

        var finalRank = ( ( lengthRank * 10 ) - longPasswordLength ) + ( numbersRank * 10 ) + ( specialCharsRank * 15 ) + ( uppercaseLettersRank * 10 );
        if( finalRank < 0 ) finalRank = 0;
        if( finalRank > 100 ) finalRank = 100;

        return finalRank;
    };

    return app;

})( {%= client_js_module_name %} || {} );

if( typeof module !== "undefined" && typeof exports !== "undefined" ){
    module.exports = {%= client_js_module_name %}.password;
}