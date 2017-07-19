/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
#To compile it you need to go to:
        http://closure-compiler.appspot.com/home

Then copy:
        // ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name libphonenumber.js
// @use_closure_library true
// @code_url https://github.com/googlei18n/libphonenumber/raw/master/javascript/i18n/phonenumbers/phonemetadata.pb.js
// @code_url https://github.com/googlei18n/libphonenumber/raw/master/javascript/i18n/phonenumbers/phonenumber.pb.js
// @code_url https://github.com/googlei18n/libphonenumber/raw/master/javascript/i18n/phonenumbers/metadata.js
// @code_url https://github.com/googlei18n/libphonenumber/raw/master/javascript/i18n/phonenumbers/phonenumberutil.js
// @code_url https://github.com/googlei18n/libphonenumber/raw/master/javascript/i18n/phonenumbers/asyoutypeformatter.js
// @formatting pretty_print
// ==/ClosureCompiler==
function buildAndValidatePhone(phoneNumber, countryCode) {
var strIntlNumber = "invalid";

try {
    var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
    var regionCode = phoneUtil.getRegionCodeForCountryCode(countryCode);
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);

    if (phoneUtil.isValidNumber(number)) {
        var PNT = i18n.phonenumbers.PhoneNumberType;
        var numberType = phoneUtil.getNumberType(number);

        if (numberType == PNT.MOBILE) {
            var PNF = i18n.phonenumbers.PhoneNumberFormat;
            strIntlNumber = phoneUtil.format(number, PNF.E164);
            strIntlNumber = strIntlNumber.replace('+','');
        }
    }
}
catch(ex) {
console.log(ex);
}

return strIntlNumber;
};


Then compile and get the .js file !


*/