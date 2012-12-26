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
 * @see $.youtubeutil.events
 * @constructor
 */
;(function ($) {
	"use strict";
	$.youtubeutil = $.youtubeutil || {};
	$.youtubeutil.dataapi = $.youtubeutil.dataapi || {};

	$.youtubeutil.dataapi.FeedClient = (function(){
		var _instance,
		version = 2;

		function getInstance() {
				if (_instance) {
					return _instance;
				}
			return _instance = _FeedClient();
		}

		function _FeedClient() {
			//private Property
			var _requestId = 0,
			_requestQueue = [];

			//public Methods
			/**
			 *
			 * @param {string} videoId
			 */
			function getVideo(videoId) {
				var url = "http://gdata.youtube.com/feeds/api/videos/" + videoId,
				query = {
					"v":""+version,
					"alt":"json"
				};
				return runLoader(url, query, doVideoLoaded, { comment: "video", videoId: videoId } );
			}

			/**
			 *
			 * @param {string} playlistId
			 * @param {object} option :	.startIndex はじめ default 1
			 * 							.maxResults おわり default 50
			 */
			function getPlaylist(playlistId, option) {
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
			}

			//private Methods
			function runLoader(url, query, doComplete, wrapper) {
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
					return function( data, textStatus) {
						doComplete(data, wrapper);
					}
				})(wrapper))
				.fail(function( data, textStatus) {
				})
				.always(function( data, textStatus) {
				});
				return _requestId - 1;
			}

			function doPlaylistLoaded(result, wrapper) {
				if(typeof wrapper.callBack=="function"){
					wrapper.callBack(wrapper.id, result);
				}
				$(that).trigger($.youtubeutil.events.VideoFeedEvent.VIDEO_PLAYLIST_DATA_RECEIVED, [wrapper.id, result]);
			}

			function doVideoLoaded(result, wrapper) {
				if(typeof wrapper.callBack=="function"){
					wrapper.callBack(wrapper.id, result);
				}
				$(that).trigger($.youtubeutil.events.VideoDataEvent.VIDEO_INFO_RECEIVED, [wrapper.id, result]);
			}

			var that = {"getVideo":getVideo,
				"getPlaylist":getPlaylist,
				"version":version
			};

			return that;
		}
		return {"getInstance":getInstance};
	})();

}(jQuery));
