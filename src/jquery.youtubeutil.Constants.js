//YouTube Utilities

/**
 * @fileoverview YouTube APIのための便利クラス集
 * @author interactive@nowri.in (Kensuke Amano)
 */

//-------------------------------------------------------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------------------------------------------------------


;(function ($) {
	"use strict";

// namespace:
	$.youtubeutil = $.youtubeutil || {};

	var e = $.youtubeutil.Constants = $.youtubeutil.Constants || {};

	e.SearchType = {
		STD_TOP_RATED : "top_rated",
		STD_TOP_FAVORITES : "top_favorites",
		STD_MOST_VIEWED : "most_viewed",
		STD_MOST_DISCUSSED : "most_discussed",
		STD_MOST_LINKED : "most_linked",
		STD_MOST_RESPONSED : "most_responded",
		STD_RECENTLY_FEATURED : "recently_featured",
		STD_MOBILE_VIDEOS : "watch_on_mobile"
	};

}(jQuery));
