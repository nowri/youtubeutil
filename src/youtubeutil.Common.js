//YouTube Utilities

/**
 * @fileoverview YouTube APIのための便利クラス集
 * @author interactive@nowri.in (Kensuke Amano)
 */

//-------------------------------------------------------------------------------------------------------------------
// Common
//-------------------------------------------------------------------------------------------------------------------
/**
 * Copyright (c) 2012,Christian Johansen (http://tddjs.com/)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var tddjs=function(){return{namespace:function(a){var b=this;a=a.split(".");for(var c=0,f=a.length;c<f;c++)"undefined"==typeof b[a[c]]&&(b[a[c]]={}),b=b[a[c]];return b}}}();tddjs.uid=function(){var a=0;return function(b){"number"!=typeof b.__uid&&(b.__uid=a++);return b.__uid}}();tddjs.iterator=function(){return function(a){function b(){var g=a[c++];b.hasNext=c<f;return g}var c=0,f=a.length;b.hasNext=c<f;return b}}();
tddjs.isOwnProperty=function(){var a=Object.prototype.hasOwnProperty;if("function"==typeof a)return function(b,c){return a.call(b,c)}}();
tddjs.each=function(){function a(a,b){for(var c=b.length,d=0;d<c;d++)a[b[d]]=!0;var d=c,e;for(e in a)tddjs.isOwnProperty(a,e)&&(d-=1,a[e]=!1);if(d){e=[];for(d=0;d<c;d++)a[b[d]]&&e.push(b[d]);return e}}var b=a({},"toString toLocaleString valueOf hasOwnProperty isPrototypeOf constructor propertyIsEnumerable".split(" ")),c=a(function(){},["call","apply","prototype"]);c&&b&&(c=b.concat(c));var f={object:b,"function":c};return function(a,b){if("function"!=typeof b)throw new TypeError("callback is not a function");
for(var c in a)tddjs.isOwnProperty(a,c)&&b(c,a[c]);if(c=f[typeof a])for(var d,e=0,h=c.length;e<h;e++)d=c[e],tddjs.isOwnProperty(a,d)&&b(d,a[d])}}();tddjs.extend=function(){return function(a,b){a=a||{};if(!b)return a;tddjs.each(b,function(b,f){a[b]=f});return a}}();

/**
 * Copyright (c) 2012,Christian Johansen (http://tddjs.com/)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
Function.prototype.bind||function(){var c=Array.prototype.slice;Function.prototype.bind=function(a){var b=this;if(1<arguments.length){var d=c.call(arguments,1);return function(){var e=d;0<arguments.length&&(e=d.concat(c.call(arguments)));return b.apply(a,e)}}return function(){return 0<arguments.length?b.apply(a,arguments):b.call(a)}}}();


/**
 * youtubeutil.Common
 *
 */
var youtubeutil = youtubeutil || {};
(function(){
	"use strict";
	youtubeutil.Common = {
		runAcyncArray : function(params, onProcess) {

			if(!params || !params.length){
				return;
			}
			var paramList = params.concat();
			(function() {
				"use strict";
				var startTime = new Date();
				while ( 1 ) {
					var curParam = paramList.shift();
					onProcess( curParam );
					if ( paramList.length <= 0 ) {
						return;
					}
					if ( (new Date()) - startTime > 100 ) {
						break;
					}
				}
				setTimeout( youtubeutil.Common.runAcyncArray, 40 );
			})();
		}
	};
})();