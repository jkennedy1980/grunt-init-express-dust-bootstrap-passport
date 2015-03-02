( function( exports ){
    
    if( !exports.password ) exports.password = {};
    exports.minimumPasswordStrength = 50;
    exports.bestPasswordStrength = 70;

    exports.passwordIsSecureEnough = function( password ){
        var strength = exports.getPasswordStrength( password );
        return ( strength >= exports.minimumPasswordStrength );
    };
    
    exports.getPasswordStrength = function( password ){
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
    
})( typeof exports === 'undefined' ? this['{%= client_js_module_name %}_PasswordUtils'] = {} : exports );