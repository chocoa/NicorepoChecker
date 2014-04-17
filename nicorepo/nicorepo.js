// 配列に含まれているかチェック
Array.prototype.exists = function(value) {
	for(var i in this){
		if(this[i] == value) return true;
	}
	return false;
}
// 配列の重複除去
Array.prototype.unique = function() {
	var o = {}, i, l = this.length, n = [];
	for (i = 0; i < l; i++) o[this[i]] = this[i];
	for (i in o) n.push(o[i]);
	return n;
}
function KeyExists ( obj, key ) {
	if( !obj || (obj.constructor !== Array && obj.constructor !== Object) ) {
		return false;
	}
	return key in obj;
}
// テキストからDOMを生成
function getDOMfromText(text) {
	var div = document.createElement("div");
	if(div) {
		div.innerHTML = text;
	}
	return div;
}

///////////////////////////
// ニコレポクラス 
///////////////////////////
function CNicoRepo() {
	this.request = new XMLHttpRequest();
	this.settings = localStorage;
	this.noticeID = 0;
	// デフォルト
	if(!this.settings.lastcheck)		this.settings.lastcheck = 0 + new Date();			// 最終チェック時間
	if(!this.settings.checkinterval)	this.settings.checkinterval = 60 * 1000;			// チェック間隔(60秒)
	if(!this.settings.popuptime)		this.settings.popuptime = 10 * 1000;				// ポップアップ表示時間(10秒)
	if(!this.settings.pb_none_color)	this.settings.pb_none_color = "#EEEEEE";			// ポップアップ背景色 不明
	if(!this.settings.pb_user_color)	this.settings.pb_user_color = "#FFDDEE";			// ポップアップ背景色 ユーザー
	if(!this.settings.pb_comm_color)	this.settings.pb_comm_color = "#DDFFEE";			// ポップアップ背景色 コミュニティ
	if(!this.settings.voice_use)		this.settings.voice_use = 1;						// 棒読みちゃん使用
	if(!this.settings.voice_speed)		this.settings.voice_speed = -1;						// 棒読みちゃん速度
	if(!this.settings.voice_pitch)		this.settings.voice_pitch = -1;						// 棒読みちゃん音程
	if(!this.settings.voice_volume)		this.settings.voice_volume = -1;					// 棒読みちゃん音量
	if(!this.settings.voice_type)		this.settings.voice_type = 0;						// 棒読みちゃんタイプ
	if(!this.settings.permission)		this.settings.permission = '{"new":{}}';			// 表示設定
	this.permission = JSON.parse(this.settings.permission);
	this.types = [
		"user_video_upload", "動画投稿", 1,
		"user_video_ranking", "動画ランクイン", 1,
		"user_video_review", "動画レビュー", 1,
		"user_video_advertised", "動画広告宣伝", 1,
		"user_video_round_number_of_view_counter", "動画キリ番", 1,
		"user_mylist_add", "マイリスト登録", 1,
		"user_mylist_add_seiga_theme", "お題マイリスト登録", 1,
		"user_mylist_add_manga_episode", "漫画マイリスト登録", 1,
		"user_uad_advertise", "広告通知", 1,
		"user_live_broadcast", "生放送開始", 1,
		"user_live_reserve", "生放送予約", 1,
		"user_live_video_introduced", "生放送紹介", 1,
		"user_seiga_image_upload", "イラスト投稿", 1,
		"user_seiga_image_clip", "イラストクリップ", 1,
		"user_manga_episode_upload", "漫画投稿", 1,
		"user_nicoru_video", "レビューをニコル", 1,
		"user_nicoru_nicorepo", "ニコレポをニコル", 1,
		"user_action_stamp", "スタンプ取得", 1,
		"user_app_install", "アプリ登録", 1,
		"user_watchlist_registered", "マイリスト入り", 1,
		"user_register_chblog", "ブロマガ投稿", 1,
		"user_mylist_add_blomaga", "ブロマガマイリスト登録", 1,
		"community_action_info", "お知らせ追加", 3,
		"community_action_level", "コミュレベル更新", 3,
		"community_video_upload", "動画追加", 3,
		"community_live_broadcast", "生放送開始", 3,
		"community_live_reserve", "生放送予約", 3,
		"community_register_chblog", "ブロマガ投稿", 3
	];
}
CNicoRepo.prototype.default_icon = "icon128.png";
CNicoRepo.prototype.timeline_url = "http://flapi.nicovideo.jp/api/gettimeline";

// パーミッションの取得
CNicoRepo.prototype.getPermission = function(type,id) {
	if(!KeyExists(this.permission,id)) this.permission[id] = JSON.parse('{}');
	if(!KeyExists(this.permission[id],type)) {
		if(id=="new") {
			this.setPermission(type, id, 1); // default on
		} else if(id=="all") {
			this.setPermission(type, id, 0); // all default off
		} else {
			this.setPermission(type, id, this.getPermission(type,"new"));
		}
	}
	return this.permission[id][type];
};

// パーミッションの設定
CNicoRepo.prototype.setPermission = function(type,id,value) {
	this.permission[id][type] = value;
	this.settings.permission = JSON.stringify( this.permission );
};
CNicoRepo.prototype.getName = function(id) {
	
	if(!KeyExists(this.permission,id)) this.permission[id] = JSON.parse('{}');
	if(!KeyExists(this.permission[id],"name") || this.permission[id]["name"] == "undefined") {
		this.getCUName(id);
	}
	return this.permission[id]["name"];
}
CNicoRepo.prototype.setName = function(id, value) {
	this.permission[id]["name"] = value;
	this.settings.permission = JSON.stringify( this.permission );
}

// タイムラインの取得
CNicoRepo.prototype.getTimeline = function(handler) {
	var req = this.request;
	req.onreadystatechange = function() {
		if(req.readyState == 4 && req.status == 200) {
			var ret = JSON.parse(req.responseText);
			if(handler) handler(ret);
		}
	};
	//console.log("getTimeline:GET"+ this.timeline_url + "?at=" + this.settings.lastcheck);
	req.open("GET", this.timeline_url + "?at=" + this.settings.lastcheck, true);
	req.send();
};

// タイムラインのチェック
CNicoRepo.prototype.checkTimeLine = function(_this) {
	me = _this || this;
	var dd = new Date();
	var st = me.settings.lastcheck;
	dd.setTime(parseInt(st));
	me.getTimeline( function(ret){
		if(ret["timeline"] && ret["timeline"].length > 0){
			ret["timeline"] = ret["timeline"].reverse();
			for(i=0;i<ret["timeline"].length;i++) {
				me.showPopup(ret["timeline"][i]);
			}
			//this.settings.lastcheck = ret["access_time"];
			me.settings.lastcheck = ret["timeline"][--i]["t"]+1;
		}
	});
	if(this.checktimer) clearTimeout(me.checktimer);
	this.checktimer = setTimeout(me.checkTimeLine, parseInt(me.settings.checkinterval),me);
};

// ID上位の取得
CNicoRepo.prototype.getIDh = function(id) {
	if(id.length <= 4) {
		return "0";
	} else {
		return id.substring(0,id.length-4);
	}
};

// ポップアップの表示
CNicoRepo.prototype.showPopup = function(data) {
	var type = data["c"];
	var authorid = data["i"];
	var message = data["m"];
	var author = data["o"];
	var time = data["t"];
	var mode = data["y"];
	// IDがディレクトリ分割されている為、上位桁を取得
	authorid_h = this.getIDh(authorid);
	// ポップアップ内容をモードごとに構築
	var lurl, msg, icon, pbc;
	console.log("mode:"+mode+"type:"+type+" user:"+authorid);
	switch(mode) {
		case '1': // 個人
			lurl = "http://www.nicovideo.jp/user/"+authorid;
			msg = message;
			icon = "http://usericon.nimg.jp/usericon/"+authorid_h+"/"+authorid+".jpg";
			pbc = this.settings.pb_user_color;
			// パーミッションのチェック
			console.log("type:"+type+" user:"+authorid);
			if(this.getPermission(type,authorid)==0) {
				console.log("popup cancelled");
				return;
			}
			break;
		case '3': // コミュ
			lurl = "http://com.nicovideo.jp/community/co"+authorid;
			msg = message;
			icon = "http://icon.nimg.jp/community/"+authorid_h+"/co"+authorid+".jpg";
			pbc = this.settings.pb_comm_color;
			console.log("type:"+type+" comm:co"+authorid);
			if(this.getPermission(type,"co"+authorid)==0) {
				console.log("popup cancelled");
				return;
			}
			break;
		default:
			msg = mode + message;
			icon = this.default_icon;
			pbc = this.settings.pb_none_color;
			break;
	}
	
	// タイプ
	type = this.getTitle(type);
	// 時刻の整形
	var stime = new Date(time/10);
	stime = stime.getDate() + "日" + stime.getHours() + ":" + stime.getMinutes();
	// ポップアップのセットアップ
	var options = {
		type: 'basic',
		title : type + stime,
		message : "【"+author+"】" + msg,
		priority : 2
	};
	var me = this;
	// アイコン読み込み
	var request = new XMLHttpRequest();
	request.open("GET", icon);
	request.responseType = "blob";
	request.onload = function(){
		var blob = this.response;
		options.iconUrl = window.URL.createObjectURL(blob);
		console.log(options.iconUrl);
		// ポップアップ表示
		chrome.notifications.create("nrc" + me.noticeID++ + "!" + lurl, options, 
			function noticeCreated(noticeID) {
				setTimeout(function() {
					console.log("timeout clear :" + noticeID);
					chrome.notifications.clear(noticeID, null);
				}, parseInt(me.settings.popuptime));
			}
		);
	};
	request.send(null);
	
	// 棒読みちゃん
	if(this.settings.voice_use==1) bouyomi_talk( author + "。" + message );
};
// ポップアップがクリックされた時のイベント
chrome.notifications.onClicked.addListener( function(noticeID) {
	console.log("clicked :" + noticeID);
	var url = noticeID.split("!");
	console.log("url :" + url[1]);
	chrome.tabs.create({ url: url[1], selected: true });
});

// ポップアップの表示
CNicoRepo.prototype.getTitle = function(type) {
	var i = this.types.indexOf(type);
	if(i==-1) return "<span style='color:red'>不明:"+type+"</span>";
	return this.types[i+1];
};

// コミュ・ユーザー名の取得
CNicoRepo.prototype.getCUName = function(id) {
	if (id.indexOf("co")==-1) {
		this.getUserName(id);
	} else {
		this.getCommName(id);
	}
}

// コミュ名の取得
CNicoRepo.prototype.getCommName = function(comm_no) {
	var request = new XMLHttpRequest();
	var me = this;
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			var doc = getDOMfromText(request.responseText);
			var name = doc.getElementsByTagName("h1")[0].innerText;
			me.setName(comm_no, name);
		}
	};
	request.open("GET", "http://com.nicovideo.jp/community/" + comm_no, true);
	request.send();
}

// ユーザー名の取得
CNicoRepo.prototype.getUserName = function(user_no) {
	var request = new XMLHttpRequest();
	var me = this;
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			var doc = getDOMfromText(request.responseText);
			var h = doc.getElementsByTagName("h2")[0];
			var itext = h.innerHTML;
			var name = itext.slice(0, itext.indexOf("<small>"));
			if(name.indexOf("短時間での連続アクセス")==-1) {
				me.setName(user_no, name);
			}
		}
	};
	request.open("GET", "http://www.nicovideo.jp/user/" + user_no, true);
	request.send();
}

///////////////////////////

// 棒読みちゃんに喋らせる
function bouyomi_talk(text)
{
	var delim = "<bouyomi>";
	var speed = (NR.settings.voice_speed_def == true) ? -1 : NR.settings.voice_speed;
	var pitch = (NR.settings.voice_pitch_def == true) ? -1 : NR.settings.voice_pitch;
	var volume = (NR.settings.voice_volume_def == true) ? -1 : NR.settings.voice_volume;
	var type = (NR.settings.voice_type_def == true) ? 0 : NR.settings.voice_type;
	var sends = "" + speed + delim + pitch + delim + volume + delim + type + delim + text;
	//console.log("内容:"+sends);
	// 棒読みちゃんに送信
	var socket = new WebSocket('ws://localhost:50002/');
	socket.onopen = function() {
		socket.send(sends);
	}
}


///////////////////////////

// ニコレポインスタンスの生成と起動
NR = new CNicoRepo();
NR.checkTimeLine();
