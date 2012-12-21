//YouTube Utilities

/**
 * @fileoverview YouTube APIのための便利クラス集
 * @author interactive@nowri.in (Kensuke Amano)
 */

//-------------------------------------------------------------------------------------------------------------------
// Utilities for PLAYER API
//-------------------------------------------------------------------------------------------------------------------

/**
 * jquery.youtubeutil.playerapi.createIframeDom
 *
 * Iframe版YoutubeのjQuery DOMオブジェクトを返してくれるやつです
 */
;(function ($) {
	"use strict";
	$.youtubeutil = $.youtubeutil || {};
	$.youtubeutil.playerapi = $.youtubeutil.playerapi || {};
	$.youtubeutil.playerapi.createIframeDom = function(videoId, videoWidth, videoHeight, playerVars, iframeId) {
		if(!videoId){
			alert("Errorrr!!!!!!!!!!!! : no argument videoId");
			return null;
		}
		var build_query = function (a){function g(h,a){var b=[],c;for(c in a)a[c]instanceof Array||e(a[c])?b.push(g(h+"["+c+"]",a[c])):j(a[c])&&b.push(d(h+"["+c+"]")+"="+d(!0===a[c]?1:!1===a[c]?0:a[c]));return b.join("&")}function j(a){return"boolean"==typeof a||"string"==typeof a||"number"==typeof a}function d(a){return encodeURIComponent(a+"").replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A").replace(/%20/g,"+")}function e(a){return null!=a&&"object"==typeof a&& "[object Array]"!=Object.prototype.toString.call(a)}if(a instanceof Array||e(a)){var f=[],b;for(b in a)a[b]instanceof Array||e(a[b])?f.push(g(b,a[b])):j(a[b])&&f.push(d(b)+"="+d(!0===a[b]?1:!1===a[b]?0:a[b]));return f.join("&")}throw Error("Parameter 1 expected to be Array or Object.");};
		var playerVarsStr = "";
		if(playerVars){
			playerVarsStr = build_query(playerVars);
			if(playerVarsStr){
				playerVarsStr = "?"+playerVarsStr;
			}
		}
		return $("<iframe>", ((iframeId)? {id:iframeId}:{}))
			.width((videoWidth)? videoWidth:640)
			.height((videoHeight)? videoHeight:360)
			.css("border", "none")
			.attr({
				"src" : "https://www.youtube.com/embed/"+videoId+playerVarsStr,
				"type" : "text/html"
			});
	};

}(jQuery));
