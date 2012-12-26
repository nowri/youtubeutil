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
 * @class FeedClient
 * @uses $.youtubeutil.events
 * @uses $.youtubeutil.Constants
 * @static
 */
;(function ($) {
	"use strict";
	$.youtubeutil = $.youtubeutil || {};
	$.youtubeutil.dataapi = $.youtubeutil.dataapi || {};
	$.youtubeutil.dataapi.FeedClient = (function() {

		//private Property
		var _requestId = 0,
			_requestQueue = [],
			version = 2,
			Constants = $.youtubeutil.Constants,
			e = $.youtubeutil.events;

		//public Methods
		/**
		 *
		 * @param {string} videoId
		 */
		function getVideo(videoId, option) {
			var url = "http://gdata.youtube.com/feeds/api/videos/" + videoId,
			query = {
				"v":""+ version,
				"alt":"json"
			};
			return runLoader(url, query, doVideoLoaded, {callBack:option["callBack"], comment: "video", _videoId: videoId } );
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

		function getUserContacts(username, categories, startIndex, maxResults) {
			//TODO 未実装
		}

		function getStandardFeed(type, time, startIndex, maxResults, option) {

			startIndex = startIndex || 1;
			maxResults = maxResults || 50;
			var url = "http://gdata.youtube.com/feeds/api/standardfeeds/" + type,
				query = {
					"v":""+version,
					"alt":"json",
					"start-index":""+startIndex,
					"max-results":""+maxResults
				};

			if (type == Constants.SearchType.STD_TOP_RATED &&
				type == Constants.SearchType.STD_MOST_VIEWED &&
				time.length > 0) {
				query["time"] = time;
			}

			return runLoader(url, query, doStdFeedLoaded, {callBack:option["callBack"], comment: "standard_feed", type:type, time:time } );
		}


		function getVideos(search, author, categories, keywords, orderBy, racy, startIndex, maxResults, option) {

			startIndex = startIndex || 1;
			maxResults = maxResults || 50;
			orderBy = orderBy || "relevance";
			racy = racy || "exclude";
			search = search || "";
			author = author || "";

			var url = "http://gdata.youtube.com/feeds/api/videos",
				query = {
					"v":""+version,
					"alt":"json",
					"start-index":""+startIndex,
					"max-results":""+maxResults,
					"racy":racy,
					"orderBy":orderBy
				};

			if (categories instanceof Array === true && categories.length > 0) {
				url += "/-/" + categories.join("%7C");
			}

			if (keywords instanceof Array && keywords.length > 0) {
				if (url.indexOf("/-/") == -1)
					url += "/-";
				url += "/" + keywords.join("%7C");
			}

			if (search.length > 0){
				query["vq"] = search;
			}

			if (author.length > 0){
				query["author"] = author;
			}

			return runLoader(url, query, doVideosLoaded, {callBack:option["callBack"], comment: "videos", search:search, author:author, categories:categories, keywords:keywords, orderBy:orderBy, racy:racy, startIndex:startIndex, maxResults:maxResults } );
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

		function doStdFeedLoaded(result, wrapper) {
			if(typeof wrapper.callBack=="function"){
				wrapper.callBack(wrapper.id, result);
			}
			$(that).trigger(e.StandardVideoFeedEvent.STANDARD_VIDEO_DATA_RECEIVED, [wrapper.id, result]);
		}

		function doPlaylistLoaded(result, wrapper) {
			if(typeof wrapper.callBack=="function"){
				wrapper.callBack(wrapper.id, result);
			}
			$(that).trigger(e.VideoFeedEvent.VIDEO_PLAYLIST_DATA_RECEIVED, [wrapper.id, result]);
		}

		function doVideoLoaded(result, wrapper) {
			if(typeof wrapper.callBack=="function"){
				wrapper.callBack(wrapper.id, result);
			}
			$(that).trigger(e.VideoDataEvent.VIDEO_INFO_RECEIVED, [wrapper.id, result]);
		}

		function doVideosLoaded(result, wrapper) {
			if(typeof wrapper.callBack=="function"){
				wrapper.callBack(wrapper.id, result);
			}
			$(that).trigger(e.VideoFeedEvent.VIDEO_DATA_RECEIVED, [wrapper.id, result]);
		}

		var that = {
			"getVideo":getVideo,
			"getVideos":getVideos,
			"getPlaylist":getPlaylist,
			"getStandardFeed":getStandardFeed,
			"getVersion":function(){return version;},
			"setVersion":function(_version){version = _version;}
		};

		return that;
	})();

}(jQuery));
