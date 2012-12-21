//YouTube Utilities

/**
 * @fileoverview YouTube APIのための便利クラス集
 * @author interactive@nowri.in (Kensuke Amano)
 */

//-------------------------------------------------------------------------------------------------------------------
// Utilities for DATA API
//-------------------------------------------------------------------------------------------------------------------

/**
 * jquery.youtubeutil.dataapi.FeedClient
 *
 * 各YouTube Data APIにリクエストしてレスポンスをObjectで返してくれる
 *
 * @constructor
 */
;(function ($) {
	"use strict";
	$.youtubeutil = $.youtubeutil || {};
	$.youtubeutil.dataapi = $.youtubeutil.dataapi || {};
	$.youtubeutil.dataapi.FeedClient = (function(){
		"use strict";
		var _instance,
		version = 2,
		getInstance = function() {
			"use strict";
				if (_instance) {
					return _instance;
				}
			return _instance = _FeedClient();
		},

		_FeedClient = function() {
			"use strict";
			//private Property
			var _requestId = 0,
			_requestQueue = [],

			//public Methods
			/**
			 *
			 * @param {string} videoId
			 */
			getVideo = function(videoId){
				"use strict";
				var url = "http://gdata.youtube.com/feeds/api/videos/" + videoId,
				query = {
					"v":""+version,
					"alt":"json"
				};
				return runLoader(url, query, doVideoLoaded, { comment: "video", videoId: videoId } );
			},

			/**
			 *
			 * @param {string} playlistId
			 * @param {object} option :	.startIndex はじめ default 1
			 * 							.maxResults おわり default 50
			 */
			getPlaylist = function(playlistId, option){
				"use strict";
				option = option || {};
				var startIndex = option["startIndex"] || 1,
				maxResults = option["maxResults"] || 50,
				query = {
					"v":""+version,
					"alt":"json",
					"start-index":""+startIndex,
					"max-results":""+maxResults
				},
				url = "http://gdata.youtube.com/feeds/api/playlists/" + playlistId;
				return runLoader(url, query, doPlaylistLoaded, {callBack:option["callBack"], comment:"playlist", playlistId:playlistId } );
			},

			//private Methods
			runLoader = function (url, query, doComplete, wrapper) {
				"use strict";
				wrapper.id = _requestId++;
				wrapper.success = false;
				_requestQueue.push(wrapper);
				var str="";
				$.each(query, function(i, val){
					str+=i+":"+val+"\n";
				});

				$.ajax({
					"type": "GET",
					"url": url,
					"dataType": "jsonp",
					"data": query,
					"scriptCharset": "utf-8",
					"crossDomain":true
				})
				.done((function(wrapper){
					"use strict";
					return function( data, textStatus) {
						doComplete(data, wrapper);
					}
				})(wrapper))
				.fail(function( data, textStatus) {
					"use strict";
				})
				.always(function( data, textStatus) {
					"use strict";
				});
				return _requestId - 1;
			},

			doPlaylistLoaded = function (result, wrapper) {
				"use strict";
				if(typeof wrapper.callBack=="function"){
					wrapper.callBack(wrapper.id, result);
				}
				$(that).trigger($.youtubeutil.events.VideoFeedEvent.VIDEO_PLAYLIST_DATA_RECEIVED, [wrapper.id, result]);
			},

			doVideoLoaded = function (result, wrapper) {
				"use strict";
				if(typeof wrapper.callBack=="function"){
					wrapper.callBack(wrapper.id, result);
				}
				$(that).trigger($.youtubeutil.events.VideoDataEvent.VIDEO_INFO_RECEIVED, [wrapper.id, result]);
			},

			that = {"getVideo":getVideo,
				"getPlaylist":getPlaylist,
				"version":version
			};

			return that;
		};
		return {"getInstance":getInstance};
	})();

	$.youtubeutil.events = $.youtubeutil.events || {};
	$.youtubeutil.events.VideoFeedEvent = {"VIDEO_PLAYLIST_DATA_RECEIVED":"videoPlaylistDataReceived"};
	$.youtubeutil.events.VideoDataEvent = {"VIDEO_INFO_RECEIVED":"videoInfoReceived"};

}(jQuery));
