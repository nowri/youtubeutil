//YouTube Utilities

/**
 * @fileoverview YouTube APIのための便利クラス集
 * @author interactive@nowri.in (Kensuke Amano)
 */


//-------------------------------------------------------------------------------------------------------------------
// Shortcut
//-------------------------------------------------------------------------------------------------------------------

// namespace:

/**
 *
 * ショートカットクラス
 *
 * @class YouTubeUtil
 * @static
 *
 */
var YouTubeUtil = YouTubeUtil || {};
(function(){
	"use strict";
	/**
	 * @uses youtubeutil.dataapi.FeedClient
	 */
	YouTubeUtil.loadPlayLists = function(a,b,c){return youtubeutil.dataapi.FeedClient.loadPlayLists(a,b,c)};
})();
