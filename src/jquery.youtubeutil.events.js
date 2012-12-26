//YouTube Utilities

/**
 * @fileoverview YouTube APIのための便利クラス集
 * @author interactive@nowri.in (Kensuke Amano)
 */

//-------------------------------------------------------------------------------------------------------------------
// Events
//-------------------------------------------------------------------------------------------------------------------

/**
 *
 * $.youtubeutil.events
 * @static
 */
;(function ($) {
	"use strict";

	$.youtubeutil = $.youtubeutil || {};
	var e = $.youtubeutil.events = $.youtubeutil.events || {};

	/**
	 *
	 * $.youtubeutil.events.VideoFeedEvent
	 *
	 * @type {{VIDEO_PLAYLIST_DATA_RECEIVED: string}}
	 */
	e.VideoFeedEvent = {
		"VIDEO_PLAYLIST_DATA_RECEIVED":"videoPlaylistDataReceived"
	};

	/**
	 *
	 * $.youtubeutil.events.VideoDataEvent
	 *
	 * @type {{VIDEO_INFO_RECEIVED: string}}
	 */
	e.VideoDataEvent = {
		"VIDEO_INFO_RECEIVED":"videoInfoReceived"
	};

}(jQuery));
