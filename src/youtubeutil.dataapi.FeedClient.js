//YouTube Utilities

/**
 * @fileoverview YouTube APIのための便利クラス集
 * @author interactive@nowri.in (Kensuke Amano)
 */

//-------------------------------------------------------------------------------------------------------------------
// Utilities for DATA API
//-------------------------------------------------------------------------------------------------------------------

// namespace
var youtubeutil = youtubeutil || {};
youtubeutil.dataapi = youtubeutil.dataapi || {};

/**
 *
 * jquery.dataapi.youtubeutil.FeedClientから各Dataを取得
 *
 * @class FeedClient
 * @uses jquery.dataapi.youtubeutil.FeedClient
 * @static
 *
 */
youtubeutil.dataapi.FeedClient = (function() {

	"use strict";

 // mix-ins:

 // private properties:
	var $feed,
		_playListUidList = [],
		_playListCueList = [],
		e = $.youtubeutil.events;

// constructor:
	/**
	 *
	 * @method init
	 */
	function init() {
		$feed = $.youtubeutil.dataapi.FeedClient;
		$($feed).on(e.VideoFeedEvent.VIDEO_PLAYLIST_DATA_RECEIVED, videoFeedEventHandler);
	}

// public methods:
	/***
	 *
	 * @param {string} uid
	 * @param {array} lists
	 * @param {function} callBack
	 */
	var loadPlayLists = function(uid, lists, callBack) {
		if(!setPlayListUID(uid)){
			return false;
		}

		var cueVO = new CuePlayListVO(uid, lists, callBack);
		_playListCueList.push(cueVO);
		var id;

		runAcyncArray(lists, function(id) {
			$feed.getPlaylist(id);
		});
		return true;
	},

// private methods:
	runAcyncArray = function(params, onProcess) {
		if(!params || !params.length){
			return;
		}
		var paramList = params.concat();
		(function() {
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
			setTimeout( runAcyncArray, 40 );
		})();
	},

	setPlayListUID = function(uid) {
		for(var i= 0, len=_playListUidList.length; i<len; i++){
			if(_playListUidList[i] == uid){
				return false;
			}
		}
		_playListUidList.push(uid);
		return true;
	},



	setWorkLists = function(_feed) {
		var plId = getPlayListID(_feed["yt$playlistId"]["$t"]);
		var cueVO;
		for(var i=0; i<_playListCueList.length; i++){
			cueVO = _playListCueList[i];
			for(var j=0; j<cueVO.lists.length; j++){
				if(cueVO.lists[j] == plId){
					if(!cueVO.workLists){
						cueVO.workLists = [];
					}
					if(!cueVO.workLists[j]){
						cueVO.workLists[j] = WorkListVO(plId, getPlayListsCount(_feed["openSearch$totalResults"]["$t"])+1);
					}
				}
			}
		}
	},

	checkState = function() {
		var cueVO;
		for(var i=0; i<_playListCueList.length; i++){
			cueVO = _playListCueList[i];
			if(!cueVO.videoLists || !cueVO.videoLists.length){
				continue;
			}
			var ar;
			var wVO;
			var isLoadCueComplete = true;
			for(var j=0; j<cueVO.videoLists.length; j++){
				ar = cueVO.videoLists[j];

				if(!ar){
					isLoadCueComplete = false;
					continue;
				}
				wVO = cueVO.workLists[j];
				for(var l=0; l<ar.length; l++) {
					if(ar[l]){
						wVO.arraySetted[l] = true;
					}
				}
			}
			var isBreak = false;
			for (var m=0; m<cueVO.lists.length; m++){
				var wvo = cueVO.workLists[m];
				if(!wvo)
				{
					isLoadCueComplete = false;
					break;
				}
				for(var k=0; k<wvo.arraySetted.length; k++){
					if(!wvo.arraySetted[k]){
						isLoadCueComplete = false;
						isBreak = true;
						break;
					}
				}
				if(isBreak==true){
					break;
				}
			}
			if(isLoadCueComplete){
				noteLoadComplete(cueVO);
			}
		}
	},

	noteLoadComplete = function(cue_vo) {
		for (var l = 0; l<_playListCueList.length; l++){
			if(_playListCueList[l] == cue_vo){
				_playListCueList.splice(l, 1);
			}
		}
		var ar;
		var rawObjects = [];
		var sendList = [];
		for(var i=0; i<cue_vo.videoLists.length; i++){
			ar = cue_vo.videoLists[i];
			for(var j=0; j<ar.length; j++){
				var arr = ar[j];

				for(var k = 0; k < arr.length; k++){
					var rawObject = arr[k];
					if(rawObject["app$control"]){
						if(rawObject["app$control"]["app$draft"] && rawObject["app$control"]["app$draft"]["$t"]==="yes"){
							continue;
						}
						if(typeof rawObject["app$control"]["yt$state"] === "object"){
							continue;
						}
					}
					rawObjects.push(rawObject);
					var thumb;
					var thumbs = rawObject["media$group"]["media$thumbnail"];
					for(var l= 0,lenL=thumbs.length; l<lenL; l++){
						var el = thumbs[l];
						if(el["yt$name"] == "hqdefault"){
							thumb = el;
							break;
						}
					}

					var url = rawObject["media$group"]["media$player"]["url"];
					var vc;
					try{
						vc = rawObject["yt$statistics"]["viewCount"];
					}catch(e){
						vc = 0;
					}
					var aspectRatio;
					if(rawObject["media$group"]["yt$aspectRatio"]){
						aspectRatio = rawObject["media$group"]["yt$aspectRatio"]["$t"]
					}
					else{
						aspectRatio = "";
					}
					var obj = {
						"title":rawObject["media$group"]["media$title"]["$t"],
						"viewCount":vc,
						"ytUrl":/[/?=]([-\w]{11})/.exec(url)[1],
						"thumbnail":thumb,
						"aspectRatio":aspectRatio
					};
					sendList.push(obj);
				}
			}
		}
		cue_vo.callBack(cue_vo.uid, rawObjects, sendList);
	},

	loadRemainPlayList = function(_feed) {
		var id = getPlayListID(_feed["yt$playlistId"]["$t"]);
		var len = getPlayListsCount(_feed["openSearch$totalResults"]["$t"])+1;
		var ar = [];
		for(var i=1; i<len; i++){
			ar.push(i*50+1);
		}
		runAcyncArray(ar, function(index) {
			$feed.getPlaylist(id, {"startIndex":index, "maxResults":50});
		});
	},

	setVideoLists = function(_feed) {
		var plID = getPlayListID(_feed["yt$playlistId"]["$t"]);
		var index = getPlayListsCount(_feed["openSearch$startIndex"]["$t"]);
		var j;
		var wVO;
		var vo;
		var isBreak = false;
		for(var i=0; i<_playListCueList.length; i++) {
			vo = _playListCueList[i];
			for(j = 0; j<vo.workLists.length; j++) {
				wVO = vo.workLists[j];
				if(!wVO){
					continue;
				}
				if(wVO.plID==plID){
					if(!wVO.arraySetted[index]){
						isBreak = true;
						break;
					}
				}
			}
			if(isBreak===true){
				break;
			}
			vo = null;
		}
		if(!vo){
			return;
		}
		if(!vo.videoLists){
			vo.videoLists = [];
		}
		if(!vo.videoLists[j]){
			vo.videoLists[j] = [];
		}
		var data;
		if(!vo.videoLists[j][index]){
			vo.videoLists[j][index] = [];
		}

		for(var k= 0,len=_feed["entry"].length; k<len; k++) {
			data = _feed["entry"][k];
			vo.videoLists[j][index].push(data);
		}
	},

	getPlayListID = function(feedId) {
		return feedId.split("PL")[1];
	},

	getPlayListsCount = function(index) {
		return (index==1)? 0:Math.ceil(index/50)-1;
	},

	//Event Handler
	videoFeedEventHandler = function(_e, id, json) {
		switch(_e.type){
			case e.VideoFeedEvent.VIDEO_PLAYLIST_DATA_RECEIVED:
				var _feed = json["feed"];
				var startIndex = _feed["openSearch$startIndex"]["$t"];
				if(startIndex==1){
					setWorkLists(_feed);
					setVideoLists(_feed);
					checkState();
					loadRemainPlayList(_feed);
				}
				else{
					setVideoLists(_feed);
					checkState();
				}
				break;
		}
	};

	//Classes
	var CuePlayListVO = function(_uid, _lists, _callBack) {
		this.uid = _uid;
		this.lists = _lists;
		this.callBack = _callBack;
		this.workLists = [];
		this.videoLists = [];
	};
	(function(p){
		p.hasMe = function(pl_id) {
			for (var i= 0,len=this.lists.length; i<len; i++){
				if(this.lists[i]==pl_id){
					return i;
				}
			}
			return -1;
		};
	})(CuePlayListVO.prototype);

	var WorkListVO = function(plId, length) {
		var arraySetted = [],
		that = {
			"plID":plId,
			"arraySetted":arraySetted
		};
		for (var i=0; i<length; i++) {
			arraySetted[i]=false;
		}
		return that;
	},

	that = {
		"loadPlayLists":loadPlayLists
	};

	init();
	return that;
})();
