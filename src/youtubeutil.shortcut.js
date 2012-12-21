//YouTube Utilities

/**
 * @fileoverview YouTube APIのための便利クラス集
 * @author interactive@nowri.in (Kensuke Amano)
 */


//-------------------------------------------------------------------------------------------------------------------
// Shortcut
//-------------------------------------------------------------------------------------------------------------------

/**
 * ショートカットクラス
 *
 * @static
 * @constructor
 */
var YouTubeUtil = YouTubeUtil || {};
(function(){
	"use strict";
	/**
	 * @see youtubeutil.dataapi.FeedClient
	 * @see youtubeutil.dataapi.FeedClient.loadPlayLists
	 */
	YouTubeUtil.loadPlayLists = function(a,b,c){return youtubeutil.dataapi.FeedClient.loadPlayLists(a,b,c)};
})();


