/* global ProjectSettings, Globals, myDB */
/*
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'external/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../../resources/js/app',
        bootstrap: '../bootstrap'
        
    }
});

// Start the main app logic.
requirejs(['jquery'], function ($) {*/
$(document).ready(function(){    
//------------------------------------------------------------------------------
//  Exmple definition for widget pluggins
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'example';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = false;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        // You can use this.element and this.options
        $(this.element).css({backgroundColor:this.options.myColor});
    };
    
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Setter with object values
    Plugin.prototype.setText = function (obj) {
         $(this.element).find("p").text(obj.text);
         $(this.element).find("p").css({color: obj.color});
         this._log("Widget name: " + this._name);
     };
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    }; 
    //Example of setter without options
    Plugin.prototype.setDefaultText = function () {
         this._log("In setDefaultText");
         $(this.element).find("p").text("this is my default text from setDefaultText");
         $(this.element).find("p").css({color: "black"});
         this._log("Widget name: " + this._name);
    };     
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );

//------------------------------------------------------------------------------
//  pluginProfilePicture : widget
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginProfilePicture';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = false;
        this._input = this.options.inputDisabled;
        this._imageSize = this.options.imageSize;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myWidget = $(this.element);
        // You can use this.element and this.options
        var myHtml = '\
            <img class="widget-profile-picture-image" alt="profile picture" src="./resources/img/profile_user_default.png"/> \
            <span></span> \
            <input class="widget-profile-picture-input" type="file"></input>';
        $(this.element).html(myHtml);
        $(this.element).find("input").prop('disabled', this.options.inputDisabled);
        $(this.element).find('img').css({
                    width: "100%",
                    height: "100%",
                    backgroundSize: "100%",
                    backgroundPosition: "center",
                    display: "block",
                    position: "relative",
                    borderRadius: "50%",
                    border: "2px solid white",
                    boxShadow: "0 4px 16px 0 rgba(0,0,0,0.8)",
                    boxSizing: "border-box"
        });
        if(this.options.inputDisabled) {
            $(this.element).find('input').css({width:0,height:0});
        } else {
            $(this.element).find('input').css({
                    width:"80%",
                    height:"80%",
                    display:"block",
                    position:"relative",
                    top:"-100%", 
                    border:"none",
                    outline:"none",
                    color:"white",
                    background: "white",
                    opacity:"0"
            });
        }
        var myImg = $(this.element).find('img');
        var imgSize = this._imageSize;
        $(this.element).find('input').change(function(e) {
            var myFiles = e.target.files;
            var myFile = myFiles[0];
            var url = $(this).val();
            var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
            var img = document.createElement("img"); //Create a image element for resize
            if (myFiles && myFile && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    img.src = e.target.result; 
                };
                reader.onloadend = function(e) {
                    var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');
                    var destSize = imgSize;

                    var sourceSize;
                    var sourceWidth = img.width;
                    var sourceHeight = img.height;
                    var ratio;
                    if (sourceWidth>=sourceHeight) {
                        var sourceX = (sourceWidth - sourceHeight)/2;
                        var sourceY = 0;
                        sourceSize=sourceHeight;
                    } else {
                        var sourceX = 0;
                        var sourceY = (sourceHeight - sourceWidth)/2;
                        sourceSize=sourceWidth;
                    }
                    canvas.width = destSize;
                    canvas.height= destSize;
                    ctx.clearRect(0,0,canvas.width, canvas.heigth);
                    ctx.drawImage(img, sourceX,sourceY, sourceSize, sourceSize, 0, 0, destSize,destSize);
                    var myStr = canvas.toDataURL();
                    myImg.attr('src', canvas.toDataURL());           
                };
                reader.readAsDataURL(myFile);
            } else {
                myImg.attr('src',"./resources/img/profile_user_default.png");
            }          
        });
    };
    //Enables input
    Plugin.prototype.enableInput = function() {
        if (this._debug) console.log(this._name + ":: enableInput");
        $(this.element).find("input").prop('disabled',false);
        this._input=false;
    };
     //Disables input
    Plugin.prototype.disableInput = function() {
        if (this._debug) console.log(this._name + ":: disableInput");
        $(this.element).find("input").prop('disabled', true);
        this._input=true;
    };
    //Display the icon of loggedOut
    Plugin.prototype.setLoggedOut = function() {
        $(this.element).find("span").html('<i class="mdi mdi-18px mdi-close-circle"></i>')
                    .css({color:"red", top:"-=15px", right:"-=35px"});
        $(this.element).find("i").css({position:"absolute", top:"0px",right:"-10px"});
        
    };
    //Display the icon of loggedIn
    Plugin.prototype.setLoggedIn = function() {
        $(this.element).find("span").html('<i class="mdi mdi-18px mdi-check-circle"></i>')
                .css({visibility:"visible", color:"#76ff03", top:"-=15px", right:"-=35px"});
        $(this.element).find("i").css({position:"absolute", top:"0px",right:"-10px"});
    };
     //Set the image
    Plugin.prototype.setImage = function(myImage) {         
        $(this.element).find('img').attr('src',myImage);
    };
    Plugin.prototype.setDefaultImage = function() {  
        $(this.element).find('img').attr('src',"./resources/img/profile_user_default.png");
    };    
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Get the string of the image 
    Plugin.prototype.getImageString = function () {
       this._log("getImageString returning image");
       return $(this.element).find('img').attr('src');
    }; 
  
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                    
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getImageString'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        inputDisabled: false,
        imageSize:200
    };
})( jQuery, window, document );





//------------------------------------------------------------------------------
//  pluginPhoneDropdown : widget
//------------------------------------------------------------------------------

;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginPhoneDropdown';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = false;
        this._country = this.options.defaultCountry;
        this._code = "";
        this._countries = [
            {iso: 'FR', name: 'France', code:'+33'},  
            {iso: 'ES', name: 'Espana', code:'+34'}, 
            {iso: 'IT', name: 'Italia', code:'+39'},
            {iso: 'US', name: 'USA', code:'+001'}
        ];
        this.init();
    }
    //Checks if the country exists and if not returns the default
        //Gets the country code
    Plugin.prototype._getCountryIso = function(iso) {
        for(var i = 0; i<this._countries.length; i++) {
            if (this._countries[i].iso === iso) {
                return this._countries[i].iso;
            }
        }
        this._log("Country "+ iso + " not found !");
        return this.options.defaultCountry;
    },
    //Gets the country code
    Plugin.prototype._getCountryCode = function(iso) {
        for(var i = 0; i<this._countries.length; i++) {
            if (this._countries[i].iso === iso) {
                return this._countries[i].code;
            }
        }        
    },
    //Gets the country full name        
    Plugin.prototype._getCountryName = function(iso) {
        for(var i = 0; i<this._countries.length; i++) {
            if (this._countries[i].iso === iso) {
                return this._countries[i].name;
            }
        }        
    };
    //Updates the country        
    Plugin.prototype._updateCountry = function(iso) {
        this._country = iso;
        var myButton = $(this.element).find('.widget-phone-dropdown-button');
        var myWidget = $(this.element);
        this._setFlagPosition(myButton.find('.country i'), this._getCountryIso(iso));
        $(this.element).find('.widget-phone-dropdown-code').text(' (' + this._getCountryCode(iso) + ') ');
        $(this.element).data("selectedCountryCode", this._getCountryCode(iso));
        this._log("Stored country code : " + this._getCountryCode(iso));
    
    };
     //Updates the country        
    Plugin.prototype._setFlagPosition = function(myElem, iso) {
        function calcPos(letter, size) {
            return -(letter.toLowerCase().charCodeAt(0) - 97) * size;
        }
        var size = {
                w: 20,
                h: 15
            };
        var x = calcPos(iso[1], size.w),
            y = calcPos(iso[0], size.h);

        myElem.css('background-position', [x, 'px ', y, 'px'].join('')); 
    
    };   
    
    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myHtml = '\
                          <button class="widget-phone-dropdown-button" type="button"> \
                            <span class="country widget-phone-dropdown-button-header" data-country="'+this._country +'" > <i></i></span> \
                          </button>\
                          <ul class="widget-phone-dropdown-content">';
        for(var i = 0; i<this._countries.length; i++) {
                myHtml = myHtml + '<li><span class="country" data-country="' + this._countries[i].iso +'"><i></i>'  + this._countries[i].name + ' </span></li>';
        }
        myHtml = myHtml + '</ul></div>';
        $(this.element).html(myHtml);  
        var myButton = $(this.element).find('.widget-phone-dropdown-button');
        var myContent = $(this.element).find('.widget-phone-dropdown-content');
        var myWidget = $(this.element);
        var myTarget = this;
        $(this.element).data("selectedCountryCode", this._getCountryCode(this.options.defaultCountry));
        this._log("Stored country code : " + this._getCountryCode(this.options.defaultCountry));
        myContent.css({display:"none"}); 
        //Add flags on all list elements
        $(this.element).find('.country i').css({         
                    background: "url(./resources/img/country-flags.png) no-repeat"
        });
        //Set the right flag and text at each country 
        $(this.element).find('.country i').each(function() {
            myTarget._setFlagPosition($(this), $(this).parent().data("country"));
            $(this).after('<span class="widget-phone-dropdown-code"> (' + myTarget._getCountryCode($(this).parent().data("country"))+ ') \<span>' );
        });
        //When element of the list is clicked we update the header button
        $(this.element).find('.widget-phone-dropdown-content span').on('click', function() {
            myContent.css({display:"none"});     //Change to none
            myTarget._updateCountry($(this).data("country"));
        });
        //When we click the main button we toggle the content
        myButton.on('click', function() {
            myContent.css({zIndex:20});
            if (myContent.css("display") !== "none") myContent.css({display:"none"});     //Change to none
            else myContent.css({display:"block"});
        });
    };
    
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getCountry = function () {
       this._log("Selected country is : " +this._country );
       return this._country;
    }; 
    //Example of Getter 
    Plugin.prototype.getCountryCode = function () {
       this._log("Selected country is : " +this._country );
       return this._getCountryCode(this._country);;
    };     
    
    //Example of setter without options
    Plugin.prototype.setCountry = function (iso) {
        //Check if it exists, otherwise come back to default
        var myCountry = this._getCountryIso(iso).toUpperCase();
        this._log("Setting country to : " + myCountry);
        this._updateCountry(myCountry);

        
    };     
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getCountry', 'getCountryCode'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        defaultCountry: "ES"
    };
})( jQuery, window, document );


//------------------------------------------------------------------------------
//  pluginTextInputLayout : widget
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginTextInputLayout';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = false;
        this._isValidInput = false;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        // You can use this.element and this.options
        
        //Insert the country selector
        if ($(this.element).data('type') === "phone"){
                var widgetHTML = '<div class="widget-country-dropdown"></div>';
                $(this.element).append(widgetHTML);
        }
        
        var widgetHTML = '<div class="widget-text-input-layout-main-div"> \
                            <input class="widget-text-input-layout-input" type="text" data-type="'+ $(this.element).data('type') +'" autocomplete="off" spellcheck="false"> \
                            <label class="widget-text-input-layout-label">' + $(this.element).data('label') + '</label>\
                            <label class="widget-text-input-layout-error"></label> \
                            <span class="widget-text-input-layout-bar"></span> \
                            <\div>';
        $(this.element).append(widgetHTML);
        
        if ($(this.element).data('type') === "define_password" && $(this.element).data('has-shadow') === true) {
                var widgetHTML = '<div class="widget-text-input-layout-main-div"> \
                            <input class="widget-text-input-layout-input widget-text-input-layout-shadow" data-type="shadow_password" type="text"  autocomplete="off" spellcheck="false"> \
                            <label class="widget-text-input-layout-label widget-text-input-layout-shadow">' + $(this.element).data('label-shadow') + '</label>\
                            <label class="widget-text-input-layout-error widget-text-input-layout-shadow"></label> \
                            <span class="widget-text-input-layout-bar"></span> \
                            <\div>';               
                $(this.element).append(widgetHTML);
        }
        $(this.element).find(".widget-country-dropdown").pluginPhoneDropdown();
        //Initialize isValidInput to false
        $(this.element).find(".widget-text-input-layout-input").data("isValidInput", false);
        //Add eye in case of password
        var re = /password/;
        if (re.test($(this.element).data('type'))) {
            var widgetHTML = '<i class="mdi mdi-24px mdi-eye-off widget-text-input-layout-icon"></i>';
            $(this.element).find('.widget-text-input-layout-bar').before(widgetHTML);
        }
        var settings = this.options;
        
        var pos = $(this.element).offset();
        
        var widgetWidth = pos.right - pos.left; //Take the width of the widget div width   
        var finalHeight = parseInt(settings.widgetHeight,10);
        finalHeight = finalHeight + parseInt(settings.paddingTop,10) + parseInt(settings.paddingBottom,10);
        $(this.element).css({
                position:"relative",
                display:"block",
                fontSize: settings.inputTextSize,
                fontFamily: settings.fontFamily,
                height: finalHeight + "px",
                width:widgetWidth,
                "box-sizing": "border-box"
        });        
        if ($(this.element).data("has-shadow") === true ) {
            $(this.element).css({height: (2*finalHeight) + "px"});
        }
        //Do the formatting
        $(this.element).find('.widget-text-input-layout-main-div').css({
                /*backgroundColor: settings.backgroundColor,*/
                paddingBottom:settings.paddingBottom, 
                paddingTop: settings.paddingTop,
                marginLeft: "0px",
                marginRight: "0px",
                textAlign:"left",
                height: finalHeight,
                width:widgetWidth,
                "box-sizing": "border-box"
        });
        var finalTop = finalHeight/2;
        finalHeight = finalHeight + 10 + 30;
        $(this.element).find('.widget-text-input-layout-input').css({
                position:"relative",
                top:0,
                fontSize:settings.inputTextSize,
                padding:"0px 0px 0px 0px",
                display:"block",
                textAlign:"left",
                width:"100%",
                border: "none",
                borderBottom:"1px solid " +  settings.colorTextOnBlur,
                color: settings.colorTextOnBlur,
                "box-sizing": "border-box"     
        });
        //errorLabel format
        var myTop = "-" + settings.labelSizeOnBlur;
        $(this.element).find('.widget-text-input-layout-error').css( {
                color: this.options.errorLabelColor,
                fontSize:this.options.errorLabelSize,
                fontFamily: "sans-serif",
                display:"block",
                textAlign:"left",               
                position:"relative",
                height:"15px",
                top:"-25px",
                left:"0px"
        });
        //Put phone country side by side with entry
        if ($(this.element).data('type')=== "phone") {
            $(this.element).css({display:"flex","flex-direction":"row"});
            $(this.element).find(".widget-text-input-layout-main-div").css({flex:"2 0 0"});
            $(this.element).find(".widget-country-dropdown").css({flex:"1 0 0",marginRight:"10px"});           
        }

        //eyeIcon format
        $(this.element).find(".widget-text-input-layout-main-div").each(function () {
            var target = $(this);
            target.find(".widget-text-input-layout-input").each(function () {
                var pos = $(this).position();
                var width = $(this).outerWidth();
                var height = $(this).outerHeight();
                target.find('.widget-text-input-layout-icon').css( {
                    color: settings.colorTextOnBlur,
                    fontSize: "14px",
                    textAlign:"left",
                    fontFamily: "sans-serif",
                    position: "absolute",
                    left: (pos.left + width - 24 - parseInt(settings.eyeMarginRight, 10)) + "px",
                    top: (pos.top + height - 24 - parseInt(settings.eyeMarginBottom, 10)) + "px"
                });
            });           
        });
        //Handle the mouse pointer
        $(this.element).find('.widget-text-input-layout-input').hover(function() {
            if (!$(this).hasClass("widget-text-input-layout-hasFocus"))
                    $(this).css("cursor", "pointer"); 
        });
        $(this.element).find('.widget-text-input-layout-icon').hover(function() {
                    $(this).css("cursor", "pointer"); 
        });       
        //Label formatting       
        $(this.element).each(function (index) {
            $(this).find(".widget-text-input-layout-input").each(function () {
                var myTop = $(this).outerHeight();
                myTop = "-" + myTop + "px";
                $(this).next(".widget-text-input-layout-label").css( {
                    color: settings.colorTextOnBlur,
                    fontSize:settings.labelSizeOnBlur,
                    fontWeight:"normal",
                    position: "relative",                   
                    pointerEvents:"none",
                    left: "0px", //pos.left + "px",
                    top: myTop //(pos.top + parseInt(settings.labelSizeOnBlur, 10)) +"px"
                });
            });
        });
         //Do the text coloring of label and input on focus    
        var target = $(this.element);
        $(this.element).find('.widget-text-input-layout-input').focus(function() {
            //Set the hasFocus class on all the childrens of the input that has focus
            $(this).parent().children().addClass("widget-text-input-layout-hasFocus");
            //Change the color of the input
            $(this).css({
                outline:"none", 
                color: settings.colorTextOnFocus,
                "border-bottom-color": settings.colorTextOnFocus,
                "cursor":"auto"
            });    
            //Change the color of the label
            target.find(".widget-text-input-layout-label.widget-text-input-layout-hasFocus").css({color: settings.colorTextOnFocus });  
            
            //Change the color of the eye
            target.find(".widget-text-input-layout-icon.widget-text-input-layout-hasFocus").css({color: settings.colorTextOnFocus });
            
            //Animate the movement of the label if the size of the label is not expanded to exapand it
            if (target.find(".widget-text-input-layout-label.widget-text-input-layout-hasFocus").css("fontSize") === settings.labelSizeOnBlur) {
                target.find(".widget-text-input-layout-label.widget-text-input-layout-hasFocus").animate({ 
                    top: '-=' + settings.labelGapDistance, 
                    fontSize:settings.labelSizeOnFocus},200,function(){});
            }
            //Animate the bottom-bar anyway  
            var width = $(this).outerWidth();
            target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").css({backgroundColor: settings.colorTextOnFocus });
            target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").animate({width: "+=" + width},{ queue: false, duration: 200 }); 
            target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").animate({left:"-=" + (width/2)},{ queue: false, duration: 200 }); 
            target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").animate({right:"+=" + (width/2)},{ queue: false, duration: 200 });
        });        
        //When focus is lost
        $(this.element).find('.widget-text-input-layout-input').blur(function() {
            $(this).css({
                outline:"none", 
                color: settings.colorTextOnBlur,
                "border-bottom-color": settings.colorTextOnBlur});
            
            //Change the color of the label
            target.find(".widget-text-input-layout-label.widget-text-input-layout-hasFocus").css({color: settings.colorTextOnBlur });
            
            //Change the color of the eye
            target.find(".widget-text-input-layout-icon.widget-text-input-layout-hasFocus").css({color: settings.colorTextOnBlur });
            
            //Set label to default as it's empty and we have lost settings
            if ($(this).val() === "") {
                target.find(".widget-text-input-layout-label.widget-text-input-layout-hasFocus").animate({ 
                    top: '+=' + settings.labelGapDistance,
                    fontSize:settings.labelSizeOnBlur},200,function(){});
            }
            
            var width = target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").outerWidth();
            //Animate the bottom-bar anyway 
            target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").css({backgroundColor: settings.colorTextOnBlur });
            target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").animate({width: "-=" + width},{ queue: false, duration: 200 }); 
            target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").animate({left:"+=" + (width/2)},{ queue: false, duration: 200 }); 
            target.find(".widget-text-input-layout-bar.widget-text-input-layout-hasFocus").animate({right:"-=" + (width/2)},{ queue: false, duration: 200 });
            
            //Remove the focus attribute on the widget
            $(this).parent().children().removeClass("widget-text-input-layout-hasFocus");
        });
        
        var isIE = (navigator.userAgent.indexOf("Trident/") !== -1);
        
        //Default hidden password
        $(this.element).find(".widget-text-input-layout-input").each(function() {
            var re = /password/;
             if (re.test($(this).data("type"))) {
                if (isIE) $(this).type = "password";
                else $(this).css({webkitTextSecurity:"disc"});
             } 
        });
        //Handle the eye click 
        $(this.element).find('.widget-text-input-layout-icon').click(function() {
            //Set the hasFocus class on all the childrens of the input that has focus
            $(this).parent().children().addClass("widget-text-input-layout-eye-click");
            
            //Toggle the eye icon and un-hide the password
            if ($(this).hasClass("mdi-eye-off")) {
                if (isIE) target.find(".widget-text-input-layout-input.widget-text-input-layout-eye-click").type = "text";
                else target.find(".widget-text-input-layout-input.widget-text-input-layout-eye-click").css({webkitTextSecurity:"none"});
                $(this).addClass("mdi-eye");
                $(this).removeClass("mdi-eye-off");
            } else {  // Case we rehide the pass
                if (isIE) target.find(".widget-text-input-layout-input.widget-text-input-layout-eye-click").type = "password";
                else target.find(".widget-text-input-layout-input.widget-text-input-layout-eye-click").css({webkitTextSecurity:"disc"});
     
                $(this).addClass("mdi-eye-off");
                $(this).removeClass("mdi-eye");
            }
            
            $(this).parent().children().removeClass("widget-text-input-layout-eye-click");
        });
        //Handle the highlight bar
        $(this.element).each(function (myElem) {
            var target = $(myElem);
            $(this).find(".widget-text-input-layout-input").each(function () {
                var width = $(this).outerWidth();
                var height = $(this).outerHeight();
                
                var myTop = height+8  + parseInt($(this).parent().find(".widget-text-input-layout-error").outerHeight(),10);
                myTop = "-" + myTop + "px";
                $(this).parent().find(".widget-text-input-layout-bar").css( {
                        display:"block",
                        position: "relative",
                        pointerEvents:"none",
                        top: myTop,
                        left: (width/2) + "px",
                        height:settings.barHeight,
                        width:0
                    });
                });
        });  
        
        $(this.element).find('.widget-country-dropdown').css({paddingTop:"10px",width:"100px"});
        
        //Enable as you type error
        var myTarget = this;
        $(this.element).find(".widget-text-input-layout-input").each(function (myElem) {
            $(this).on("input", function() {
                //Reset color
                $(this).parent().find(".widget-text-input-layout-error").css({
                    color: settings.errorLabelColor
                });
                //Limit the length of the input
                var max_length;
                switch ($(this).data("type")) {
                    case "names":  max_length = 20; break;
                    case "email":  max_length = 50; break;
                    case "phone":  max_length = 20; break
                    default:       max_length= 15;
                }
                if ($(this).val().length > max_length) {
                    $(this).val($(this).val().substr(0, max_length));
                }
                
                //Handle Error as you type
                var targetErrorLabel = $(this).parent().find(".widget-text-input-layout-error");
                if (myTarget._checkInput($(this))) {
                    targetErrorLabel.html("");
                } else {
                    targetErrorLabel.html(myTarget._getErrorMessage($(this)));
                }
            });
        });    
        
    };
    //Sets Error Label
    Plugin.prototype.setError = function (text) {
        $(this.element).each(function () {
               $(this).find(".widget-text-input-layout-input").each( function () {
                     if (!$(this).data("isValidInput")) {
                         $(this).parent().find(".widget-text-input-layout-error")
                                 .css({color:"red"})
                                 .html(text);
                     }
               });
        });     
    };
    //Gets if entry is valid
    Plugin.prototype.isValidInput = function () {
        var isValid =true;
        $(this.element).find(".widget-text-input-layout-input").each(function() {
             if (!$(this).data("isValidInput")) isValid = false;
        });
        return isValid;   
    };
    
    //getInput
    Plugin.prototype.getInput = function () {
        if ($(this.element).data("type") === "phone") {
            return $(this.element).find(".widget-country-dropdown").pluginPhoneDropdown("getCountryCode") + $(this.element).find(".widget-text-input-layout-input:first").val();
        } else {
           return $(this.element).find(".widget-text-input-layout-input:first").val();
        }
    };    
    //reset the plugin
    Plugin.prototype.reset = function () {
        var settings = this.options;
        $(this.element).find(".widget-text-input-layout-input").each(function () {
               $(this).val("");
               $(this).blur();
               var myTop = $(this).outerHeight();
                myTop = "-" + myTop + "px";
                $(this).next(".widget-text-input-layout-label").css( {
                    color: settings.colorTextOnBlur,
                    fontSize:settings.labelSizeOnBlur,
                    fontWeight:"normal",
                    position: "relative",                   
                    pointerEvents:"none",
                    left: "0px", 
                    top: myTop 
                });
                $(this).parent().find(".widget-text-input-layout-error").html("");
        });
    };    
     
    
    
   //Checks if the input is valid or not
    Plugin.prototype._checkInput = function (myElem) {
        var target = this;      
        var result;
        switch(myElem.data("type")) {
                case "names":            result = target._isValidNames(myElem.val()); break;
                case "email":            result = target._isValidEmail(myElem.val()); break;
                case "phone":            result = target._isValidPhone(myElem.val()); break;
                case "define_password":  result = target._isValidPassword(myElem.val());break;
                case "confirm_password": result = target._isValidPassword(myElem.val()); break;
                case "shadow_password":          
                    result = target._isValidShadow(myElem.val(),
                                $(this.element).find('.widget-text-input-layout-input:first').val());  break;   
                default:
                    result = true; break;            
        }
        myElem.data("isValidInput", result);
        
        return result;
    };    
    
    //Prints error label while you type
    Plugin.prototype._getErrorMessage = function(myElem) {
        var target = this;
        switch(myElem.data("type")) {
                case "names": return "Incomplete name";
                case "email": return "Incomplete email";
                case "define_password": return "Password quality " + target._getPasswordQuality(myElem.val()) + "%";
                case "confirm_password": return "Incomplete password";   
                case "shadow_password": return "Not matching";
                default: return "Invalid phone";
        }
        return true;
    };
 
    
    Plugin.prototype._isValidNames = function(myString) {
        if (myString.toString().length<=1) {
            return false;
        } else { 
            return true;
        }
    };
    Plugin.prototype._isValidPhone = function(myString) {
            var selectedCountryCode = $(this.element).find('.widget-country-dropdown').data("selectedCountryCode");
            selectedCountryCode = selectedCountryCode.replace("+","");
            var myResult = buildAndValidatePhone(myString, selectedCountryCode);
            $(this.element).data("finalPhoneNumber", "+" + myResult);  //Store the result
            this._log("Stored in finalPhoneNumber data :" + "+" + myResult);
            if (myResult === "invalid") return false;
            else return true;
    };
    Plugin.prototype._isValidEmail = function(myString) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(myString);
    };
    
    Plugin.prototype._isValidPassword = function(myPassword) {
        if (this._getPasswordQuality(myPassword)>=100) return true;
        return false;
    };
    Plugin.prototype._isValidShadow = function(myPassConfirm, myPass) {
        if (myPass === myPassConfirm) return true;
        else return false;
    };  
     //Computes password quality based on the requirements
    Plugin.prototype._getPasswordQuality = function(password) {
        var length = 0, uppercase = 0, lowercase = 0, digits = 0, symbols = 0, bonus = 0, requirements = 0;
        var lettersonly = 0, numbersonly = 0, cuc = 0, clc = 0;
        
        length = password.length;
        uppercase = password.length - password.replace(/[A-Z]/g,'').length;
        lowercase = password.length - password.replace(/[a-z]/g,'').length;
        digits = password.length - password.replace(/[0-9]/g,'').length;
        symbols = length - uppercase - lowercase - digits;
      
        for (var j = 1; j < password.length - 1; j++) {
            if (this._isDigit(password.charAt(j)))
                bonus++;
        }
        for (var k = 1; k < password.length - 1; k++) {
            if (this._isUpperCase(password.charAt(k))) {
                k++;
                if (k < password.length) {
                    if (this._isUpperCase(password.charAt(k))) {
                        cuc++;
                        k--;
                    }
                }
            }
        }
        for (var l = 0; l < password.length; l++) {
            if (this._isLowerCase(password.charAt(l))) {
                l++;
                if (l < password.length) {
                    if (this._isLowerCase(password.charAt(l))) {
                        clc++;
                        l--;
                    }
                }
            }
        }
        
        if (length > 4) { requirements++;}
        if (uppercase > 0) { requirements++; }
        if (lowercase > 0) { requirements++; }
        if (digits > 0) { requirements++; }
        if (symbols > 0) { requirements++; }
        if (bonus > 0) { requirements++;}
        if (digits === 0 && symbols === 0) { lettersonly = 1; }
        if (lowercase === 0 && uppercase === 0 && symbols === 0) { numbersonly = 1;}
        var Total = (length * 10) + ((length - uppercase) * 2)
                + ((length - lowercase) * 2) + (digits * 4) + (symbols * 6)
                + (bonus * 2) + (requirements * 2) - (lettersonly * length*2)
                - (numbersonly * length*3) - (cuc * 2) - (clc * 2);
        if (Total > 100) Total = 100;
        return Total;
    };
    
    Plugin.prototype._isUpperCase = function(character) {
       if (character.replace(/[A-Z]/g,'')=== "") return true;
       else return false;
    };

    Plugin.prototype._isLowerCase = function(character) {
       if (character.replace(/[a-z]/g,'')=== "") return true;
       else return false;
    };
    Plugin.prototype._isDigit = function(character) {       
       if (character.replace(/[0-9]/g,'')=== "") return true;
       else return false;         
    };      
    
    
    
    
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['isValidInput', 'getInput'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
            backgroundColor: "white",
            fontFamily: "verdana",
            colorTextOnFocus: "#00C853",//Color of all text with focus
            colorTextOnBlur: "#388E3C", //Color of all text when no focus
            widgetHeight: "25px",       //widget height
            inputTextSize: "16px",      //Text size of the input text box
            labelSizeOnBlur: "15px",    //Label size when no focus
            labelSizeOnFocus: "10px",   //Label size when we have focus
            labelGapDistance: "20px",   //Distance that we want the label to go up
            barHeight:  "2px",        //Bar height when animation
            errorLabelColor: "#A4B42B", 
            errorLabelSize: "12px",
            eyeMarginBottom: "3px",
            eyeMarginRight: "5px",
            paddingTop:"15px",
            paddingBottom:"15px",
            marginLeft:"0px",
            marginRight:"0px"
    };
})( jQuery, window, document );


//------------------------------------------------------------------------------
//  pluginFormValidator: Validate that all inputs are valid
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginFormValidator';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = false;
        this._ajaxEvent = this.options.ajaxEvent;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        this._log("Handling events named: " + this.options.ajaxEvent);
        // You can use this.element and this.options
        this._log("Created element " + pluginName);
        
        var myWidget = $(this.element);
        //Hide loader or ajax-error if any
        $(this.element).find(".widget-ajax-error-text").animate({opacity:0},200);
        $(this.element).find(".widget-ajax-error-spin").css({opacity:0});
        
        
        $(this.element).on(this.options.ajaxEvent + '.ajaxRequestAlways', function() {
            $('.body-default').removeClass('waiting');
            $(".widget-ajax-error-spin").css({opacity:0});

        });        
        $(this.element).on(this.options.ajaxEvent + '.ajaxRequestFail', function(event, errorMessage) {
            console.log("Im in the widget and I've got fail event !");
            myWidget.find(".widget-ajax-error-text").html(errorMessage).animate({opacity:1},500);
            $(".widget-ajax-error-spin").css({opacity:0});
        });
    };
        //Example of Getter 
    Plugin.prototype.isValid = function () {
       var target = this; 
       var validForm = true;
       var myWidget = $(this.element);
       $(this.element).find(".widget-text-input-layout").each (function () {
          
          target._log("input: " + $(this).attr('class') + "::isValidInput >> " + $(this).pluginTextInputLayout("isValidInput")); 
          if ($(this).pluginTextInputLayout("isValidInput") === false) {             
              $(this).pluginTextInputLayout("setError", "Invalid input");
              validForm = false;
          }
       });
       //Find if there is a widget-ajax-error div and show error
       if (!validForm) {
           $(this.element).find(".widget-ajax-error-text").html("Some fields are invalid, please check !");
           $(this.element).find(".widget-ajax-error-text").animate({opacity:1},500);
       }
       this._log("isValid result : " + validForm);
       return validForm;
    };
    //Sets the event to listen
    Plugin.prototype.setEvent = function (eventName) {
        var myWidget = $(this.element);
        $(this.element).on(eventName + '.ajaxRequestAlways', function() {
            //this._log("Im in the widget and I've got always event !");
            $('.body-default').removeClass('waiting');
            $(".widget-ajax-error-spin").css({opacity:0});

        });        
        $(this.element).on(eventName + '.ajaxRequestFail', function(event, errorMessage) {
            console.log("Im in the widget and I've got fail event ! : " + eventName);
            myWidget.find(".widget-ajax-error-text").html(errorMessage).animate({opacity:1},500);
            $(".widget-ajax-error-spin").css({opacity:0});
        });        
        
    };
    
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
         

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['isValid'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        ajaxEvent: "nothing"
    };
})( jQuery, window, document );

//------------------------------------------------------------------------------
//  pluginModalFormLogin: Modal form for login
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginModalFormLogin';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = true;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myWidget = $(this.element);
        var myObject = this;
        // You can use this.element and this.options
        var widgetHTML = '\
            <div id="id-login-modal-card" class="modal-card modal-card-center"> \
                <i class="modal-close mdi mdi-24px mdi-close-circle-outline"></i> \
                <h1>Log in</h1> \
                <div id="id-login-modal-form" class="widget-form"> \
                    <div id="id-login-modal-email" class="widget-text-input-layout" data-type="email" data-label="email"></div> \
                    <div id="id-login-modal-password" class="widget-text-input-layout" data-type="define_password" data-label="password" data-has-shadow="false"></div> \
                    <p class="checkbox-default"><input id="id-login-modal-keep-checkbox" type="checkbox">Keep me signed in</p> \
                    <p id="id-login-modal-error" class="widget-ajax-error-text">Error connecting to the server</p> \
                    <button id="id-login-modal-button-apply" class="ui-button ui-widget ui-corner-all"><i class="widget-ajax-error-spin mdi mdi-18px mdi-spin mdi-loading"></i>Log In<i class="widget-ajax-error-spin-shadow mdi mdi-18px mdi-spin mdi-loading"></i></button> \
                    <p class="text-clickable-default">Forgot password ?</p> \
                </div> \
            </div>';
        $(this.element).html(widgetHTML);
        $(this.element).find("#id-login-modal-card").css({
           minWidth:"350px" 
        });
        $(this.element).find("#id-login-modal-form").css({
           width:"80%",
           margin:"0 auto",
           textAlign:"center"
        });
        //Handle checkbox
        $(this.element).find(".checkbox-default").on('mouseenter', function() {
            $(this).css({cursor:"pointer", textDecoration:"underline"});
        });
        $(this.element).find(".checkbox-default").on('mouseleave', function() {
            $(this).css({cursor:"none", textDecoration:"none"});
        });    
        $(this.element).find(".checkbox-default").on('click', function() {
            $(this).find("input").trigger("click");
        });   
        
        $(this.element).find("#id-login-modal-button-apply").css({
           marginTop:"10px",
           marginBottom:"10px"
        });        
        
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout();
        //Handle the modal login    
        var myUser = new User();       
        $("#id-login-modal-button-apply").on('click', function() {   
            $("#id-login-modal-keep-checkbox").data("isValidInput", true); //Set input as isValid for validation 
            $("#id-login-modal-form").pluginFormValidator({ajaxEvent:"User.login"});
            myUser.callingObject = $("#id-login-modal-form");
        
            if ($("#id-login-modal-form").pluginFormValidator("isValid")) {
                myObject._log("Form is valid");
                myUser.email = $("#id-login-modal-email").pluginTextInputLayout("getInput");
                myUser.password = $("#id-login-modal-password").pluginTextInputLayout("getInput");
                myUser.keep = $("#id-login-modal-keep-checkbox").prop('checked');
                myWidget.find(".widget-ajax-error-spin").css({opacity:1});
                myUser.logIn();
            }
        });    
        $(this.element).on('User.login.ajaxRequestSuccess', function(event, response) {
            console.log("We are here and success on login, so now we need to restore");
            myObject._log("SUCCESS : user.login");
            var myResult = JSON.parse(response.account);
            //Restore the user with a new AjaxCall
            $("#id-login-modal-form").pluginFormValidator("setEvent", "User.restore");
            myUser.callingObject = $("#id-login-modal-form");
            myUser.restore(); //makes ajax call to download all user content
            $.createCookie("presence", true, ProjectSettings.sessionDurationMinutes);
            
        });
        //When the user has been restored
        $(this.element).on('User.restore.ajaxRequestSuccess', function(event, response) { 
            console.log("On restore success !!!!!");
            var myResponse = JSON.parse(response.account);
            Globals.myUser.reload(myResponse);
            
            Globals.myDB.saveMe();  //Save downloaded user into db for later usage
            Globals.myDB.getMe();  // This will trigger global event Global.User.available
            console.log("Here is the user restored :");
            console.log(Globals.myUser);
            //myUser.get();
            //Now trigger the window
            console.log("Are we triggering ?????????????????");
            jQuery(window).trigger("Global.User.loggedIn");    

            myObject.hide();
            myObject.reset();
        });
    
        //Close modal on click
        $(this.element).find(".modal-close").on('click', function () {
            console.log("removing");
            myObject.hide();
            myObject.reset();
        });
        
        $(this.element).find(".text-clickable-default").on('click', function () {
             console.log("clicked forgot !");
             myObject.hide();
             jQuery(window).trigger("Global.User.forgotPassword");
        });
        
    //End of modal login   
    };
    
    //Shows the modal
    Plugin.prototype.show = function() {
        this._log("Showing modal !");
        //$(this.element).find(".modal-card").css({width: '-=100%'});
        $(this.element).css({visibility:"visible",display:"block"});
    };  
    //Hides the modal
    Plugin.prototype.hide = function() {
        this._log("Hiding modal !");
        var myWidget = $(this.element);
        $(this.element).css({visibility:"hidden"});
        
    };    
    //Hides the modal
    Plugin.prototype.reset = function() {
        this._log("Reset form !");
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout("reset");
        $(this.element).find(".widget-ajax-error-text").css({opacity:0}); 
        $("#id-login-modal-keep-checkbox").prop('checked',false);
        
    };        
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    }; 
   
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );

//------------------------------------------------------------------------------
//  pluginModalFormValidateEmail: Modal form for validate email notification
//------------------------------------------------------------------------------

;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginModalFormValidateEmail';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = true;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        // You can use this.element and this.options
        
        var myWidget = $(this.element);
        var myObject = this;
        // You can use this.element and this.options
        var widgetHTML = '\
             <div class="modal-card modal-card-bottom modal-card-right modal-card-info"> \
                <i class="modal-close mdi mdi-24px mdi-close-circle-outline"></i> \
                <h1>Email validation</h1> \
                <h2>Your email has not been validated !</h2> \
                <p>Please go to your inbox and validate your email</p> \
                <p>If you don\'t see the validation email, check at your junk email</p> \
                <div> \
                    <button class="ui-button ui-widget ui-corner-all"><i class="widget-ajax-error-spin mdi mdi-18px mdi-spin mdi-loading"></i>Resend email<i class="widget-ajax-error-spin-shadow mdi mdi-18px mdi-spin mdi-loading"></i></button> \
                </div>  \
            </div>    ';
        $(this.element).html(widgetHTML);
        $(this.element).css({display:"none"}); 

        
        //Close modal on click
        $(".modal-close").on('click', function () {
            console.log("removing");
            myWidget.hide();
        });
        $(this.element).find("button").on('click', function() {
            console.log("Clicked");
            myWidget.find(".widget-ajax-error-spin").css({opacity:1});
            var myUser = new User();
            myUser.callingObject = myWidget;
            myUser.resendValidationEmail();

        });
        
        $(this.element).on('User.resend_validation_email.ajaxRequestAlways', function(event, response) {
           // myWidget.hide("slide", {direction:"right"},300, function() {
                myWidget.css({visibility:"hidden"});
           // });
        });

    };
    //Shows the modal
    Plugin.prototype.show = function() {
        var myWidget = $(this.element);
        myWidget.css({visibility:"visible",display:"block"});

        
    };  
    //Hides the modal
    Plugin.prototype.hide = function() {
        var myWidget = $(this.element);
        //myWidget.hide("slide", {direction:"right"},300, function() {
                myWidget.css({visibility:"hidden"});
        //});
    };        
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    };  
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );

//------------------------------------------------------------------------------
//  pluginModalFormForgotPassword: Modal form for forgotPassword
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginModalFormForgotPassword';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = true;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myWidget = $(this.element);
        var myObject = this;
        // You can use this.element and this.options
        var widgetHTML = '\
            <div id="id-forgot-password-modal-card" class="modal-card modal-card-center"> \
                <i id="id-forgot-password-modal-close" class="modal-close mdi mdi-24px mdi-close-circle-outline"></i> \
                <h1>Find your account</h1> \
                <div id="id-forgot-password-modal-form" class="widget-form"> \
                    <div id="id-forgot-password-modal-email-or-phone"> \
                        <div id="id-forgot-password-modal-email" class="widget-text-input-layout" data-type="email" data-label="email"></div> \
                    </div> \
                    <p class="checkbox-default"><input id="id-forgot-password-modal-use-email-phone" type="checkbox">Use my phone instead</p> \
                    <p id="id-forgot-password-modal-error" class="widget-ajax-error-text">Error connecting to the server</p> \
                    <button id="id-forgot-password-modal-button-find" class="ui-button ui-widget ui-corner-all"><i class="widget-ajax-error-spin mdi mdi-18px mdi-spin mdi-loading"></i>Find<i class="widget-ajax-error-spin-shadow mdi mdi-18px mdi-spin mdi-loading"></i></button> \
                </div> \
            </div> \
            <div id="id-forgot-password-modal-profile-reset-form" class="widget-form modal-card modal-card-center"> \
                   <i id="id-forgot-password-modal-profile-close" class="modal-close mdi mdi-24px mdi-close-circle-outline"></i> \
                    <div id="id-forgot-password-modal-profile"> \
                        <div id="id-forgot-password-modal-profile-text"> \
                            <p id="id-forgot-password-modal-profile-first-name-header">First name:</p> \
                            <p id="id-forgot-password-modal-profile-first-name">first</p> \
                            <p id="id-forgot-password-modal-profile-last-name-header">Last name:</p> \
                            <p id="id-forgot-password-modal-profile-last-name">last</p> \
                        </div> \
                        <div id="id-forgot-password-modal-profile-picture" class="widget-profile-picture"></div> \
                    </div> \
                    <h1 id="id-forgot-password-modal-profile-title">email</h1> \
                    <p class="text-warning"><i class="mdi mdi-36px mdi-alert"></i></p> \
                    <p class="text-warning">Are you sure you want to reset the the password ?</p>\
                    <p id="id-forgot-password-modal-profile-error" class="widget-ajax-error-text">Error connecting to the server</p> \
                    <div>\
                    <button id="id-forgot-password-modal-button-reset" class="ui-button ui-widget ui-corner-all"><i class="widget-ajax-error-spin mdi mdi-18px mdi-spin mdi-loading"></i>Reset password<i class="widget-ajax-error-spin-shadow mdi mdi-18px mdi-spin mdi-loading"></i></button> \
                    </div> \
            </div>';
        $(this.element).html(widgetHTML);
        $(this.element).find("#id-forgot-password-modal-card").css({
            width:"350px"
        });
        $(this.element).find("#id-forgot-password-modal-profile-reset-form").css({
            width:"400px"
        });
        
        $(this.element).find("#id-forgot-password-modal-button-find").css({
           marginTop:"10px",
           marginBottom:"10px"
        });
        $(this.element).find("#id-forgot-password-modal-form").css({
           width:"80%",
           margin:"0 auto",
           textAlign:"center"
        });
        $(this.element).find(".widget-profile-picture").css({
            maxWidth:"120px",
            minWidth:"120px",
            maxHeight:"120px",
            minHeight:"120px"
        });
        $(this.element).find("#id-forgot-password-modal-profile").css({
            display:"flex"
        });
        $(this.element).find("#id-forgot-password-modal-profile div").css({
            flex:1
        });
        
        $(this.element).find("#id-forgot-password-modal-button-reset").parent().css({
            textAlign:"center",
            margin:"0 auto",
            marginTop:"10px",
            marginBottom:"10px"
        });
        $(this.element).find("#id-forgot-password-modal-profile-text").css({
           padding:"10px" 
        });
        
        $(this.element).find("#id-forgot-password-modal-profile-first-name-header").css({
            fontWeight:"bold",
            marginBottom:"0px"
        });
        $(this.element).find("#id-forgot-password-modal-profile-last-name-header").css({
            fontWeight:"bold",
            marginBottom:"0px"
        });
        $(this.element).find("#id-forgot-password-modal-profile-first-name").css({
            fontFamily:"cursive"
        });
        $(this.element).find("#id-forgot-password-modal-profile-last-name").css({
            fontFamily:"cursive"
        });
        
        //Handle checkbox
        $(this.element).find(".checkbox-default").on('mouseenter', function() {
            $(this).css({cursor:"pointer", textDecoration:"underline"});
        });
        $(this.element).find(".checkbox-default").on('mouseleave', function() {
            $(this).css({cursor:"none", textDecoration:"none"});
        });    
        $(this.element).find(".checkbox-default").on('click', function() {
            $(this).find("input").trigger("click");
        });           
        
        $(this.element).find("#id-forgot-password-modal-profile-reset-form").css({display:"none"});
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout();
        $(this.element).find(".widget-profile-picture").pluginProfilePicture({inputDisabled:true});
        $(this.element).find("#id-forgot-password-modal-profile-title").css({marginTop:"0px"});
        $(this.element).find(".text-warning").css({textAlign:"center",marginBottom:"0px"});
        var myUser = new User();   //User handler
        //Handle the checkbox
        $(this.element).find("#id-forgot-password-modal-use-email-phone").data("isValidInput", true); //Always valid        
        $('#id-forgot-password-modal-use-email-phone').on('change', function() {
            myUser = new User(); //Reset the user
            if($(this).prop("checked")) {
                myWidget.find("#id-forgot-password-modal-email-or-phone").html('<div id="id-forgot-password-modal-phone" class="widget-text-input-layout" data-type="phone" data-label="phone"></div>');                
            } else {
                myWidget.find("#id-forgot-password-modal-email-or-phone").html('<div id="id-forgot-password-modal-email" class="widget-text-input-layout" data-type="email" data-label="email"></div>');                                
            }   
            myWidget.find(".widget-text-input-layout").pluginTextInputLayout();
            myWidget.find(".widget-country-dropdown").pluginPhoneDropdown("setCountry", $.readCookie("country"));
        });
        
        
        //Handle the modal find    
    
        $("#id-forgot-password-modal-button-find").on('click', function() {     
            myWidget.find("#id-forgot-password-modal-form").pluginFormValidator({ajaxEvent:"User.find"});
            myUser.callingObject = $("#id-forgot-password-modal-form");
            myWidget.find("#id-forgot-password-modal-profile-reset-form").css({display:"none"});
            if ($("#id-forgot-password-modal-form").pluginFormValidator("isValid")) {               
                myObject._log("Form is valid");
                if (myWidget.find("#id-forgot-password-modal-email").length) {
                    myUser.email = myWidget.find("#id-forgot-password-modal-email").pluginTextInputLayout("getInput");
                } else {
                    myUser.phone = myWidget.find("#id-forgot-password-modal-phone").pluginTextInputLayout("getInput");
                }
                myUser.print();
                myWidget.find(".widget-ajax-error-spin").css({opacity:1});
                
                myUser.find();
            }
        });    
        $(this.element).on('User.find.ajaxRequestSuccess', function(event, response) {
            myObject._log("SUCCESS : user.find");
            var myResult = JSON.parse(response.account);
            myWidget.find(".widget-profile-picture").pluginProfilePicture("setImage", myResult.avatar);
            myWidget.find("#id-forgot-password-modal-profile-first-name").html(myResult.firstName);
            myWidget.find("#id-forgot-password-modal-profile-last-name").html(myResult.lastName);
            myWidget.find("#id-forgot-password-modal-profile-title").html(myResult.email);
            myWidget.find("#id-forgot-password-modal-profile-reset-form").css({display:"block"});
            myWidget.find("#id-forgot-password-modal-button-reset").on('click', function() {
                $("#id-forgot-password-modal-profile-reset-form").pluginFormValidator({ajaxEvent:"User.reset_password"});
                myUser = new User();
                myUser.callingObject = $("#id-forgot-password-modal-profile-reset-form");
                myUser.email = myResult.email;
                myWidget.find(".widget-ajax-error-spin").css({opacity:1});
                myUser.resetPassword();
            });           
        });
        $(this.element).on('User.reset_password.ajaxRequestSuccess', function(event, response) {
            console.log("Password reset DONE!");
            myWidget.find("#id-forgot-password-modal-profile-reset-form").css({display:"none"});
            myObject.hide();
        });
        
        //Close modal on click
        $(this.element).find("#id-forgot-password-modal-close").on('click', function () {
            console.log("removing");
            myObject.hide();
        });
        $(this.element).find("#id-forgot-password-modal-profile-close").on('click', function () {
            console.log("removing");
            myWidget.find("#id-forgot-password-modal-profile-reset-form").css({display:"none"});
        });
         
        
        
    //End of modal login   
    };
    
    //Shows the modal
    Plugin.prototype.show = function() {
        this._log("Showing modal !");
        //$(this.element).find(".modal-card").css({width: '-=100%'});
        $(this.element).css({visibility:"visible",display:"block"});
    };  
    //Hides the modal
    Plugin.prototype.hide = function() {
        this._log("Hiding modal !");
        var myWidget = $(this.element);
        $(this.element).css({visibility:"hidden"});
        
    };    
    
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    }; 
   
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );

//------------------------------------------------------------------------------
//  pluginModalFormSingup: Modal form for login
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginModalFormSignup';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = true;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myWidget = $(this.element);
        var myObject = this;
        // You can use this.element and this.options
        var widgetHTML = '\
            <div id="id-signup-modal-card" class="modal-card modal-card-center"> \
                <i class="modal-close mdi mdi-24px mdi-close-circle-outline"></i> \
                <h1>Sign up</h1> \
                <div id="id-signup-modal-form" class="widget-form"> \
                    <div id="id-signup-modal-form-picture-names"> \
                        <div id="id-signup-modal-form-profile-picture" class="widget-profile-picture"></div> \
                        <div id="id-signup-modal-form-names-container"> \
                                <div id="id-signup-modal-form-first-name" class="widget-text-input-layout" data-type="names" data-label="first name"></div> \
                                <div id="id-signup-modal-form-last-name" class="widget-text-input-layout" data-type="names" data-label="last name"></div>  \
                        </div> \
                    </div> \
                    <div id="id-signup-modal-form-email" class="widget-text-input-layout" data-type="email" data-label="email"></div> \
                    <div id="id-signup-modal-form-phone" class="widget-text-input-layout" data-type="phone" data-label="phone"></div> \
                    <div id="id-signup-modal-form-password" class="widget-text-input-layout" data-type="define_password" data-label="password" data-label-shadow="confirm password" data-has-shadow="true"></div> \
                    <p class="checkbox-default"><input id="id-signup-modal-form-keep-checkbox" type="checkbox">Keep me signed in</p> \
                    <p id="id-signup-modal-form-error" class="widget-ajax-error-text">Error connecting to the server</p> \
                    <button id="id-signup-modal-form-button-apply" class="ui-button ui-widget ui-corner-all"><i class="widget-ajax-error-spin mdi mdi-18px mdi-spin mdi-loading"></i>Sign up<i class="widget-ajax-error-spin-shadow mdi mdi-18px mdi-spin mdi-loading"></i></button> \
                </div> \
            </div>';
        $(this.element).html(widgetHTML);
        
        //Do anything that changes width first before expanding elements
        $(this.element).find("#id-signup-modal-card").css({
            width:"400px"
        });
        $(this.element).find("#id-signup-modal-form").css({
            width:"310px",
            margin:"0 auto",
            textAlign:"center"
        });
        $(this.element).find("#id-signup-modal-form-button-apply").css({
            marginTop:"10px",
            marginBottom:"10px"
        });
        
        $(this.element).find("#id-signup-modal-form-names-container").children().css({width:"200px"});
        $(this.element).find(".widget-profile-picture").css({
            minWidth:"110px",
            minHeight:"110px",
            maxWidth:"110px",
            maxHeight:"110px",
            padding:"10px"
        });
        $(this.element).find("#id-signup-modal-form-picture-names").css({display:"flex"});
        $(this.element).find("#id-signup-modal-form-picture-names").children().css({
            flex:"1"
        });
        
        //Handle checkbox
        $(this.element).find(".checkbox-default").on('mouseenter', function() {
            $(this).css({cursor:"pointer", textDecoration:"underline"});
        });
        $(this.element).find(".checkbox-default").on('mouseleave', function() {
            $(this).css({cursor:"none", textDecoration:"none"});
        });    
        $(this.element).find(".checkbox-default").on('click', function() {
            $(this).find("input").trigger("click");
        });           
        //Expand lower level plugins
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout();
        $(this.element).find(".widget-profile-picture").pluginProfilePicture();
        $(this.element).find(".widget-country-dropdown").pluginPhoneDropdown("setCountry", $.readCookie("country"));
        //Handle the modal login    
        var myUser = new User();       
        $("#id-signup-modal-form-button-apply").on('click', function() {        
            $("#id-signup-modal-form-keep-checkbox").data("isValidInput", true); //Set input as isValid for validation 
            $("#id-signup-modal-form").pluginFormValidator({ajaxEvent:"User.signup"});
            myUser.callingObject = $("#id-signup-modal-form");
        
            if ($("#id-signup-modal-form").pluginFormValidator("isValid")) {
                myObject._log("Form is valid");
                myUser.firstName = myWidget.find("#id-signup-modal-form-first-name").pluginTextInputLayout("getInput");
                myUser.lastName = myWidget.find("#id-signup-modal-form-last-name").pluginTextInputLayout("getInput");        
                myUser.email = myWidget.find("#id-signup-modal-form-email").pluginTextInputLayout("getInput");
                myUser.phone = myWidget.find("#id-signup-modal-form-phone").pluginTextInputLayout("getInput");
                myUser.password = myWidget.find("#id-signup-modal-form-password").pluginTextInputLayout("getInput");
                myUser.avatar = myWidget.find("#id-signup-modal-form-profile-picture").pluginProfilePicture("getImageString");
                myUser.keep = $("#id-signup-modal-form-keep-checkbox").prop('checked');
                console.log("Country : " + $.readCookie("country"));
                myUser.country = $.readCookie("country");
                myUser.longitude = $.readCookie("longitude");
                myUser.latitude = $.readCookie("latitude");
                myUser.language = "en";    //For the moment only english supported !
                myWidget.find(".widget-ajax-error-spin").css({opacity:1});
                myUser.signUp();
            }
        });    
        $(this.element).on('User.signup.ajaxRequestSuccess', function(event, response) {
            myObject._log("SUCCESS : user.signup");           
            Globals.myUser.reload(myUser);
            
            Globals.myDB.saveMe();  //Save downloaded user into db for later usage
            Globals.myDB.getMe();  // This will trigger global event Global.User.available
            console.log("Here is the user restored :");
            console.log(Globals.myUser);
            //Now trigger the window
            jQuery(window).trigger("Global.User.loggedIn");    

            myObject.hide();
            myObject.reset();           
        });
    
        //Close modal on click
        $(this.element).find(".modal-close").on('click', function () {
            console.log("removing");
            myObject.hide();
            myObject.reset();
        });
        
        
    //End of modal login   
    };
    
    //Shows the modal
    Plugin.prototype.show = function() {
        this._log("Showing modal !");
        //$(this.element).find(".modal-card").css({width: '-=100%'});
        $(this.element).css({visibility:"visible",display:"block"});
    };  
    //Hides the modal
    Plugin.prototype.hide = function() {
        this._log("Hiding modal !");
        var myWidget = $(this.element);
        $(this.element).css({visibility:"hidden"});
        
    };  
    //Resets all fields
    Plugin.prototype.reset = function() {
        this._log("Reset form !");
        var myWidget = $(this.element);
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout("reset");
        $(this.element).find(".widget-profile-picture").pluginProfilePicture("setDefaultImage");
        $(this.element).find(".widget-ajax-error-text").css({opacity:0}); 
        $("#id-signup-modal-form-keep-checkbox").prop('checked',false);
    };    
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
 
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    }; 
   
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );


//------------------------------------------------------------------------------
//  pluginModalFormRemoveAccount: Modal form for remove account
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginModalFormRemoveAccount';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = true;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myWidget = $(this.element);
        var myObject = this;
        // You can use this.element and this.options
        var widgetHTML = '\
            <div id="id-remove-account-modal-card" class="modal-card modal-card-center"> \
                <i class="modal-close mdi mdi-24px mdi-close-circle-outline"></i> \
                <h1>Remove account ?</h1> \
                <div id="id-remove-account-modal-form" class="widget-form"> \
                    <div id="id-remove-account-modal-password">\
                         <p><i class="mdi mdi-48px mdi-alert"></i></p> \
                         <p>Proceed removing the account ?</p> \
                         <p>All data associated will be removed</p> \
                    </div> \
                     <p id="id-change-password-modal-error" class="widget-ajax-error-text">Error connecting to the server</p> \
                    <button id="id-remove-account-modal-button-apply" class="ui-button ui-widget ui-corner-all"><i class="widget-ajax-error-spin mdi mdi-18px mdi-spin mdi-loading"></i>Remove account<i class="widget-ajax-error-spin-shadow mdi mdi-18px mdi-spin mdi-loading"></i></button> \
                </div> \
            </div>';
        $(this.element).html(widgetHTML);
        $(this.element).find("#id-remove-account-modal-form").css({
            textAlign:"center",
            margin:"0 auto"
        });
        $(this.element).find("#id-remove-account-modal-button-apply").css({
            marginTop:"10px",
            marginBottom:"10px"
        });
        
        $(this.element).find("#id-remove-account-modal-password p").css({
            marginTop:"0px",
            marginBottom:"0px",
            color:"red",
            textAlign:"center"
        });
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout();
        //Handle the modal login    
        var myUser = new User();       
        $("#id-remove-account-modal-button-apply").on('click', function() {
            console.log("here");
            $("#id-remove-account-modal-form").pluginFormValidator({ajaxEvent:"User.remove"});
            myUser.callingObject = $("#id-remove-account-modal-form");
        
            if ($("#id-remove-account-modal-form").pluginFormValidator("isValid")) {
                myObject._log("Form is valid");
                myWidget.find(".widget-ajax-error-spin").css({opacity:1});
                myUser.removeAccount();
            }
        });    
        $(this.element).on('User.remove.ajaxRequestSuccess', function(event, response) {
            myObject._log("SUCCESS : user.remove");
            $(window).trigger("Global.User.loggedOut");
            myObject.hide();          
        });
    
        //Close modal on click
        $(this.element).find(".modal-close").on('click', function () {
            myObject.hide();
        });
        
        
    //End of modal login   
    };
    
    //Shows the modal
    Plugin.prototype.show = function() {
        this._log("Showing modal !");
        $(this.element).css({visibility:"visible",display:"block"});
    };  
    //Hides the modal
    Plugin.prototype.hide = function() {
        this._log("Hiding modal !");
        var myWidget = $(this.element);
        $(this.element).css({visibility:"hidden"});
        
    };    
    //Hides the modal
    Plugin.prototype.reset = function() {
        this._log("Reset form !");
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout("reset");
        $(this.element).find(".widget-ajax-error-text").css({opacity:0}); 
        
    };        
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    }; 
   
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );


//------------------------------------------------------------------------------
//  pluginModalFormChangePassword: Modal form for change Password
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginModalFormChangePassword';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = true;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myWidget = $(this.element);
        var myObject = this;
        // You can use this.element and this.options
        var widgetHTML = '\
            <div id="id-change-password-modal-card" class="modal-card modal-card-center"> \
                <i class="modal-close mdi mdi-24px mdi-close-circle-outline"></i> \
                <h1>Change password</h1> \
                <div id="id-change-password-modal-form" class="widget-form"> \
                    <div id="id-change-password-modal-password" class="widget-text-input-layout" data-type="define_password" data-label=" old password" data-has-shadow="false"></div> \
                    <div id="id-change-password-modal-password-new" class="widget-text-input-layout" data-type="define_password" data-label="new password" data-has-shadow="true" data-label-shadow="confirm new password"></div> \
                    <p id="id-change-password-modal-error" class="widget-ajax-error-text">Error connecting to the server</p> \
                    <button id="id-change-password-modal-button-apply" class="ui-button ui-widget ui-corner-all"><i class="widget-ajax-error-spin mdi mdi-18px mdi-spin mdi-loading"></i>Apply<i class="widget-ajax-error-spin-shadow mdi mdi-18px mdi-spin mdi-loading"></i></button> \
                </div> \
            </div>';
        $(this.element).html(widgetHTML);
        $(this.element).find("#id-change-password-modal-card").css({
            width:"350px"
        });
        $(this.element).find("#id-change-password-modal-button-apply").css({
            marginTop:"10px",
            marginBottom:"10px"
        });       
        $(this.element).find("#id-change-password-modal-form").css({
            width:"80%",
            textAlign:"center",
            margin:"0 auto"
        });
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout();
        //Handle the modal login    
        var myUser = new User();       
        $("#id-change-password-modal-button-apply").on('click', function() {        
            $("#id-change-password-modal-form").pluginFormValidator({ajaxEvent:"User.change_password"});
            myUser.callingObject = $("#id-change-password-modal-form");
        
            if ($("#id-change-password-modal-form").pluginFormValidator("isValid")) {
                myObject._log("Form is valid");
                myUser.password = $("#id-change-password-modal-password").pluginTextInputLayout("getInput");
                var new_password = $("#id-change-password-modal-password-new").pluginTextInputLayout("getInput");
                myWidget.find(".widget-ajax-error-spin").css({opacity:1});
                myUser.changePassword(new_password);
            }
        });    
        $(this.element).on('User.change_password.ajaxRequestSuccess', function(event, response) {
            myObject._log("SUCCESS : user.change_password");
            myObject.hide();
            myObject.reset();           
        });
    
        //Close modal on click
        $(this.element).find(".modal-close").on('click', function () {
            console.log("removing");
            myObject.hide();
            myObject.reset();
        });
        
        
    //End of modal login   
    };
    
    //Shows the modal
    Plugin.prototype.show = function() {
        this._log("Showing modal !");
        $(this.element).css({visibility:"visible",display:"block"});
    };  
    //Hides the modal
    Plugin.prototype.hide = function() {
        this._log("Hiding modal !");
        var myWidget = $(this.element);
        $(this.element).css({visibility:"hidden"});
        
    };    
    //Hides the modal
    Plugin.prototype.reset = function() {
        this._log("Reset form !");
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout("reset");
        $(this.element).find(".widget-ajax-error-text").css({opacity:0}); 
    };        
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    }; 
   
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );


//------------------------------------------------------------------------------
//  pluginModalFormSessionExpired: Modal form for session expired
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginModalFormSessionExpired';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = true;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myWidget = $(this.element);
        var myObject = this;
        // You can use this.element and this.options
        var widgetHTML = '\
            <div id="id-session-expired-modal-card" class="modal-card modal-card-center"> \
                <h1>Session expired</h1> \
                    <div id="id-session-expired-modal-text">\
                         <p><i class="mdi mdi-48px mdi-alert"></i></p> \
                         <p>Unfortunately your session has expired</p> \
                         <button id="id-session-expired-modal-button-apply" class="ui-button ui-widget ui-corner-all">Ok</button> \
                    </div> \
                </div> \
            </div>';
        $(this.element).html(widgetHTML);
        $(this.element).find("#id-session-expired-modal-card").css({zIndex:10000});
        $(this.element).find("#id-session-expired-modal-button-apply").css({
            marginTop:"20px",
            marginBottom:"20px"        
        });
               $(this.element).find("#id-session-expired-modal-text").css({
            margin:"0 auto",
            textAlign:"center"
        });
        $(this.element).find("#id-session-expired-modal-text p").css({
            marginTop:"0px",
            marginBottom:"0px",
            textAlign:"center"
        });
        
        //Handle the modal login    
        var myUser = new User();       
        $("#id-session-expired-modal-button-apply").on('click', function() {
            myUser.clear();
            location.reload(); //Restart the page
        });    
    
        
        
    //End of modal login   
    };
    
    //Shows the modal
    Plugin.prototype.show = function() {
        this._log("Showing modal !");
        $(this.element).css({visibility:"visible",display:"block"});
    };  
    //Hides the modal
    Plugin.prototype.hide = function() {
        this._log("Hiding modal !");
        var myWidget = $(this.element);
        $(this.element).css({visibility:"hidden"});
        
    };    
    //Hides the modal
    Plugin.prototype.reset = function() {
        this._log("Reset form !");
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout("reset");
        $(this.element).find(".widget-ajax-error-text").css({opacity:0}); 
    };        
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    }; 
   
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );

//------------------------------------------------------------------------------
//  pluginModalFormProfileEdit: Modal form for profileEdit
//------------------------------------------------------------------------------
;(function ( $, window, document, undefined ) {
    var pluginName = 'pluginModalFormProfileEdit';

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.fn[pluginName].defaults, options) ;        
        this._name = pluginName;
        this._debug = true;
        this.init();
    }

    //Main function for the pluggin
    Plugin.prototype.init = function () {
        var myWidget = $(this.element);
        var myObject = this;
        // You can use this.element and this.options
        var widgetHTML = '\
           <div id="id-profile-edit-modal-card" class="modal-card modal-card-center">\
               <i class="modal-close mdi mdi-24px mdi-close-circle-outline"></i>\
               <h1>Profile</h1>\
               <div id="id-profile-edit-modal-profile-display">\
                   <div id="id-profile-edit-modal-profile-picture-div"> \
                       <div id="id-profile-edit-modal-profile-picture" class="widget-profile-picture"></div>\
                   </div>\
                    <div id="id-profile-edit-modal-profile-text">\
                        <p id="id-profile-edit-modal-profile-text-name"><span class="widget-profile-display-description">Sergi</span> <span class="widget-profile-display-description">Redorta</span></p>\
                        <p id="id-profile-edit-modal-profile-text-email"><i class="mdi mdi-24px mdi-email"></i><span class="widget-profile-display-description">test@test.com</span></p>\
                        <p id="id-profile-edit-modal-profile-text-phone"><i class="mdi mdi-24px mdi-cellphone"></i><span class="widget-profile-display-description">+336666666</span></p> \
                        <p id="id-profile-edit-modal-profile-text-picture"><i class="mdi mdi-24px mdi-account-circle"></i><span class="widget-profile-display-description">Change picture</span></p> \
                    </div>\
               </div>\
                <p id="id-profile-edit-modal-profile-created">Account created on: <span id="id-profile-edit-modal-profile-created-date">now</span></p> \
                <div id="id-profile-edit-modal-profile-edit" class="widget-form">\
                    <h1>Profile change</h1>\
                    <div id="id-profile-edit-modal-text-input-layout"></div>\
                    <p id="id-profile-edit-modal-error" class="widget-ajax-error-text">Error connecting to the server</p>\
                    <button id="id-profile-edit-modal-button-apply" class="ui-button ui-widget ui-corner-all"><i class="widget-ajax-error-spin mdi mdi-18px mdi-spin mdi-loading"></i>Apply<i class="widget-ajax-error-spin-shadow mdi mdi-18px mdi-spin mdi-loading"></i></button> \
                </div>\
           </div>';
        $(this.element).html(widgetHTML);
        $(this.element).find("#id-profile-edit-modal-card").css({
            minWidth:"600px"
        });
        $(this.element).find("#id-profile-edit-modal-profile-display").css({
            width:"90%",
            margin:"0 auto",
            border:"1px solid #c8e6c9",
            boxShadow:"0 4px 8px 0 rgba(0,100,0,0.4)",
            borderRadius:"10px",
            padding:"10px",
            display:"flex",
            backgroundColor:"#E8F5E9"
        });
        $(this.element).find("#id-profile-edit-modal-profile-picture-div").css({
            flex:"1 0 auto"
        });
        $(this.element).find("#id-profile-edit-modal-profile-text").css({flex:"2 0 auto"});
        
        $(this.element).find("#id-profile-edit-modal-profile-picture").css({
           maxWidth:"140px",
           minWidth:"140px",
           maxHeight:"140px",
           minHeight:"140px"           
        });
        $(this.element).find("#id-profile-edit-modal-profile-text").find("p").css({
           marginBottom:"0px",
           fontWeight:"bold",
           color: "#388E3C",
           fontFamily:"cursive"
        });
        $("#id-profile-edit-modal-profile-text-name").css({fontSize:"22px"});
               
        $(this.element).find(".widget-profile-display-description").on('mouseenter', function() {
             $(this).css({cursor:"pointer",color:"#00C853",textDecoration:"none"});

        });       
        $(this.element).find(".widget-profile-display-description").on('mouseleave', function() {
             $(this).css({cursor:"none",color:"#388E3C",textDecoration:"none"});
        });  
        $("#id-profile-edit-modal-profile-text i").css({
            marginRight:"10px",
            position:"relative",
            top:"3px"
        });
        
        $("#id-profile-edit-modal-profile-created").css({
           textAlign:"center",
           fontWeight:"bold",
           color:"#A4B42B",
           marginTop:"10px"
        });
        $("#id-profile-edit-modal-profile-created span").css({
            fontWeight:"normal",
            fontFamily:"cursive"
        });
        $("#id-profile-edit-modal-profile-edit").css({
            width:"90%",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.4)",
            borderRadius: "2px",
            paddingTop:"5px",
            paddingBottom:"10px",
            margin:"0 auto",
            marginTop:"10px",
            marginBottom:"10px",
            textAlign:"center",
            paddingLeft:"50px",
            paddingRight:"50px"
        });
        $("#id-profile-edit-modal-button-apply").css({
            marginTop:"10px",
            marginBottom:"10px"
        });
        $("#id-profile-edit-modal-text-input-layout").css({height:"70px",textAlign:"center", margin:"0 auto"});
        //Generate the right html on the TextInputLayout depending on the click
        $("#id-profile-edit-modal-text-input-layout")
                    .data("update-action","first_name")
                    .html('<div class="widget-text-input-layout" data-type="names" data-label="first name"></div>')
                    .find(".widget-text-input-layout").pluginTextInputLayout();
        var myWidget = $(this.element);    
        //FirstName
        $("#id-profile-edit-modal-profile-text-name span:first").on('click', function() {
            $("#id-profile-edit-modal-text-input-layout")
                    .data("update-action","first_name")
                    .html('<div class="widget-text-input-layout" data-type="names" data-label="first name"></div>')
                    .find(".widget-text-input-layout").pluginTextInputLayout();
            myWidget.find(".widget-ajax-error-text").animate({opacity:0},200);           
        });
        //LastName
        $("#id-profile-edit-modal-profile-text-name span:nth-child(2)").on('click', function() {
            $("#id-profile-edit-modal-text-input-layout")
                    .data("update-action","last_name")
                    .html('<div class="widget-text-input-layout" data-type="names" data-label="last name"></div>')
                    .find(".widget-text-input-layout").pluginTextInputLayout();  
            myWidget.find(".widget-ajax-error-text").animate({opacity:0},200);
        });
        //Email
        $("#id-profile-edit-modal-profile-text-email span").on('click', function() {
            $("#id-profile-edit-modal-text-input-layout")
                    .data("update-action","email")
                    .html('<div class="widget-text-input-layout" data-type="email" data-label="email"></div>')
                    .find(".widget-text-input-layout").pluginTextInputLayout();
            myWidget.find(".widget-ajax-error-text").animate({opacity:0},200);
        });
        //Phone
        $("#id-profile-edit-modal-profile-text-phone span").on('click', function() {
            $("#id-profile-edit-modal-text-input-layout")
                    .data("update-action","phone")
                    .html('<div class="widget-text-input-layout" data-type="phone" data-label="phone"></div>')
                    .find(".widget-text-input-layout").pluginTextInputLayout()
                    .find(".widget-country-dropdown").pluginPhoneDropdown("setCountry", $.readCookie("country"));
            myWidget.find(".widget-ajax-error-text").animate({opacity:0},200);
 
        });       
        //ChangePicture
        $("#id-profile-edit-modal-profile-text-picture span").on('click', function() {
            $("#id-profile-edit-modal-text-input-layout")
                    .data("update-action","avatar")
                    .html('<div id="id-profile-edit-modal-profile-picture" class="widget-profile-picture"></div>')
                    .find(".widget-profile-picture").css({width:"70px",height:"70px",margin:"0 auto"}).pluginProfilePicture();
 
        });          
        //Error
        $(this.element).find(".widget-ajax-error-text").css({marginTop:"10px"});
  
        //Set initial values on display
        this._setUserData();
 
        //Do the apply on the modifications
        var myUser = Globals.myUser;
        myUser.print();
        var field;
        var value;
        $("#id-profile-edit-modal-button-apply").on('click', function() {
            myWidget.find(".widget-ajax-error-text").animate({opacity:0},200);
            $("#id-profile-edit-modal-profile-edit").pluginFormValidator({ajaxEvent:"User.change_profile"});
            myUser.callingObject = $("#id-profile-edit-modal-profile-edit");            
            if ($("#id-profile-edit-modal-profile-edit").pluginFormValidator("isValid")) {
                myObject._log("Form is valid");
                //myUser.get(); //Get all data from localStorage
                myWidget.find(".widget-ajax-error-spin").css({opacity:1});
                field = $("#id-profile-edit-modal-text-input-layout").data("update-action");
                if (field !== "avatar") {
                    value = $("#id-profile-edit-modal-text-input-layout").find(".widget-text-input-layout").pluginTextInputLayout("getInput");
                } else {
                    value = $("#id-profile-edit-modal-text-input-layout").find(".widget-profile-picture").pluginProfilePicture("getImageString");
                }
                myUser.update(field,value);
            }
        });    
        $(this.element).on('User.update.ajaxRequestAlways', function(event, response) {
            myWidget.find(".widget-ajax-error-spin").css({opacity:0});
            
        });
        
        
        $(this.element).on('User.update.ajaxRequestSuccess', function(event, response) {
            myObject._log("SUCCESS : user.update");
 
            if (field === "first_name") field = "firstName";
            if (field === "last_name") field ="lastName";
            console.log('Globals.myUser.' + field +'=' + value);
            eval('Globals.myUser.' + field +'="' + value + '"');
            Globals.myDB.saveMe();
            myObject._setUserData();

            
        });

        

        //Close modal on click
        $(this.element).find(".modal-close").on('click', function () {
            myObject.hide();
            myObject.reset();
        });
        
        
    //End of modal Edit profile   
    };
    
    //Set all data from user
    Plugin.prototype._setUserData = function() {      
        $(this.element).find("#id-profile-edit-modal-profile-picture").pluginProfilePicture({inputDisabled:true});
        $(this.element).find("#id-profile-edit-modal-profile-picture").pluginProfilePicture("setImage", localStorage.getItem("avatar_0"));
        
        var timestamp = parseInt(Globals.myUser.creation_timestamp * 1000);
        var dateText = new Date(timestamp).toLocaleDateString();
        dateText = dateText +"  "+ new Date(timestamp).toLocaleTimeString();
        $("#id-profile-edit-modal-profile-created-date").html(dateText);
        $("#id-profile-edit-modal-profile-text-name span:nth-child(1)").html(Globals.myUser.firstName);
        $("#id-profile-edit-modal-profile-text-name span:nth-child(2)").html(Globals.myUser.lastName);
        $("#id-profile-edit-modal-profile-text-email span").html(Globals.myUser.email);
        $("#id-profile-edit-modal-profile-text-phone span").html(Globals.myUser.phone);        
    };
    
    //Shows the modal
    Plugin.prototype.show = function() {
        this._log("Showing modal !");
        this._setUserData();
        $(this.element).css({visibility:"visible",display:"block"});
    };  
    //Hides the modal
    Plugin.prototype.hide = function() {
        this._log("Hiding modal !");
        var myWidget = $(this.element);
        $(this.element).css({visibility:"hidden"});
        
    };    
    //Hides the modal
    Plugin.prototype.reset = function() {
        this._log("Reset form !");
        $(this.element).find(".widget-text-input-layout").pluginTextInputLayout("reset");
        $(this.element).find(".widget-ajax-error-text").css({opacity:0}); 
    };        
    //Prints logging if debug enabled
    Plugin.prototype._log = function(txt) {
        if (this._debug) console.log(this._name + ":: " + txt);
    };
    //Enables debug
    Plugin.prototype.enableDebug = function () {
        this._debug = true;
        this._log("Debug enabled !");
    };
    //Disables debug
    Plugin.prototype.disableDebug = function () {
        this._log("Debug enabled !");
        this._debug = false;
    };
    //Removes any associated data
    Plugin.prototype.destroy = function () {
         //this.element.removeData();
    };
    
    //Example of Getter 
    Plugin.prototype.getData = function () {
       this._log("In getData !");
       return this._debug;
    }; 
   
     

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, myData ) {
        var args = arguments;
        
         if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    } else {
                        console.warn("Function " + options + " is not defined !");
                    }
                });
            }
        }
    };       
        
    
    //Declare here all the getters here !
    $.fn[pluginName].getters = ['getData'];
    //Declare the defaults here
    $.fn[pluginName].defaults = {
        propertyName: "value",
        myColor:"yellow"
    };
})( jQuery, window, document );

// -----------------------------------------------------------------------------
// Session helper 
// -----------------------------------------------------------------------------
//Does the redirection on pages, if there are cookies uses them if not passes sid at each page

//;var session ={}; 
//function ($)
//   session = {
//       gotoPage = function() {};
//       toto = function() {};
//     };
//}jQuery;
//usage : session.gotoPage()  : if we use namespaces !
;(function ($) {
    'use strict';
    $.parseUrl = function (url) {
        
        if (url.indexOf('?') === -1) {
            return {
                url: url,
                params: {}
            };
        }
        var parts = url.split('?'),
            query_string = parts[1],
            elems = query_string.split('&');
        url = parts[0];

        var i, pair, obj = {};
        for (i = 0; i < elems.length; i+= 1) {
            pair = elems[i].split('=');
            obj[pair[0]] = pair[1];
        }

        return {
            url: url,
            params: obj
        };
    };

    $.gotoPage = function (url, sid) {
        //if cookies notenabled pass the $sid
        url = ProjectSettings.domain + url;
        if (!navigator.cookieEnabled) {
            if(typeof(sid) !== 'undefined' && sid !== null) {
                $(location).attr('href', url + '?key=' + sid); 
            } else $(location).attr('href', url);
        } else {
            if(typeof(sid) !== 'undefined' && sid !== null) {
                console.log("Creating cookie... : " + sid);
                $.createCookie("key", sid,ProjectSettings.sessionDurationMinutes);
                $.createCookie("presence", true);
                
            }
            $(location).attr('href', url);
        }
    };
    
    $.getSID = function() {
        //if cookies notenabled pass the $sid
        if (!navigator.cookieEnabled) {
            console.log(window.location.href);
            console.log("Cookied disabled : " + $.parseUrl(window.location.href).params.key);
           return $.parseUrl(window.location.href).params.key;
        } else {           
            if (($.readCookie("key")=== null) && $.readCookie("presence")) {
                return null;
            }
            return $.readCookie("key");           
        }
    };        
    $.restoreSID = function () {
        //if cookies notenabled pass the $sid
        if (!navigator.cookieEnabled) {
            console.log(window.location.href);
            console.log("Cookied disabled : " + $.parseUrl(window.location.href).params.key);
           return $.parseUrl(window.location.href).params.key;
        } else {            
            if (($.readCookie("key")=== null) && $.readCookie("presence")) {
                console.log("Session expired !");
                $(location).attr('href', "../login/session-expired.html")
            }
            return $.readCookie("key");           
        }
    };
    $.isLoggedIn = function () {
        var sid = $.restoreSID();
        if(typeof(sid) !== 'undefined' && sid !== null) {
            return true;
        } else {
            return false;
        }
    };
    $.sessionLogOut = function() {
        $.eraseCookie("key");
        $.eraseCookie("presence");
        $.gotoPage("index.html");
    };
    
    
    // Cookies
    $.createCookie =   function(name, value, minutes) {
            if (minutes) {
                var date = new Date();
                date.setTime(date.getTime() + (minutes * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";               

            document.cookie = name + "=" + value + expires + "; path=/";
        };

    $.readCookie = function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
    };

    $.eraseCookie = function(name) {
            $.createCookie(name, "", -1);
    };
    
/*
    //Private Functions
    var getInput = function (name, value, parent, array, traditional) {
        var parentString;
        if (parent.length > 0) {
            parentString = parent[0];
            var i;
            for (i = 1; i < parent.length; i += 1) {
                parentString += "[" + parent[i] + "]";
            }
            if (array) {
                if (traditional)
                    name = parentString;
                else
                    name = parentString + "[" + name + "]";
            } else {
              name = parentString + "[" + name + "]";
            }
        }
        return $("<input>").attr("type", "hidden")
            .attr("name", name)
            .attr("value", value);
    };
*/
}(window.jQuery || window.Zepto || window.jqlite));



});//End of document ready
/*});//End of require*/