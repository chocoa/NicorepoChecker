document.addEventListener("DOMContentLoaded", function(){
	// 更新間隔
	var checkinterval = document.getElementById('checkinterval');
	checkinterval.addEventListener('change', function(){
		var val = parseInt(checkinterval.value);
		if(val < 60) val = 60;
		NR.settings.checkinterval = val * 1000;
	}, false);
	checkinterval.value = parseInt(NR.settings.checkinterval) / 1000;

	// 表示時間
	var popuptime = document.getElementById('popuptime');
	popuptime.addEventListener('change', function(){
		var val = parseInt(popuptime.value);
		if(val < 1) val = 1;
		NR.settings.popuptime = val * 1000;
	}, false);
	popuptime.value = parseInt(NR.settings.popuptime) / 1000;

	// ポップアップタイトル背景色 不明
	var pb_none_color = document.getElementById('pb_none_color');
	pb_none_color.addEventListener('change', function(){
		NR.settings.pb_none_color = pb_none_color.value;
	}, false);
	pb_none_color.value = NR.settings.pb_none_color;
	// ポップアップタイトル背景色 ユーザー
	var pb_user_color = document.getElementById('pb_user_color');
	pb_user_color.addEventListener('change', function(){
		NR.settings.pb_user_color = pb_user_color.value;
	}, false);
	pb_user_color.value = NR.settings.pb_user_color;
	// ポップアップタイトル背景色 コミュニティ
	var pb_comm_color = document.getElementById('pb_comm_color');
	pb_comm_color.addEventListener('change', function(){
		NR.settings.pb_comm_color = pb_comm_color.value;
	}, false);
	pb_comm_color.value = NR.settings.pb_comm_color;

	// 棒読みちゃん使用
	var voice_use = document.getElementById('voice_use');
	voice_use.addEventListener('change', function(){
		NR.settings.voice_use = (voice_use.checked == true) ? 1 : 0;
	}, false);
	voice_use.checked = (NR.settings.voice_use == 1);
	// 速度（-1:棒読みちゃん画面上の設定）50-200
	var voice_speed = document.getElementById('voice_speed');
	console.log(voice_speed);
	voice_speed.addEventListener('change', function(){
		NR.settings.voice_speed = voice_speed.value;
	}, false);
	voice_speed.value = NR.settings.voice_speed;
	// 速度-本体設定使用
	var voice_speed_def = document.getElementById('voice_speed_def');
	voice_speed_def.addEventListener('change', function(){
		NR.settings.voice_speed_def = (voice_speed_def.checked == true) ? 1 : 0;
	}, false);
	voice_speed_def.checked = (NR.settings.voice_speed_def == 1);
	// 音程（-1:棒読みちゃん画面上の設定）50-200
	var voice_pitch = document.getElementById('voice_pitch');
	voice_pitch.addEventListener('change', function(){
		NR.settings.voice_pitch = voice_pitch.value;
	}, false);
	voice_pitch.value = NR.settings.voice_pitch;
	// 音程-本体設定使用
	var voice_pitch_def = document.getElementById('voice_pitch_def');
	voice_pitch_def.addEventListener('change', function(){
		NR.settings.voice_pitch_def = (voice_pitch_def.checked == true) ? 1 : 0;
	}, false);
	voice_pitch_def.checked = (NR.settings.voice_pitch_def == 1);
	// 音量（-1:棒読みちゃん画面上の設定）0-100
	var voice_volume = document.getElementById('voice_volume');
	voice_volume.addEventListener('change', function(){
		NR.settings.voice_volume = voice_volume.value;
	}, false);
	voice_volume.value = NR.settings.voice_volume;
	// 音量-本体設定使用
	var voice_volume_def = document.getElementById('voice_volume_def');
	voice_volume_def.addEventListener('change', function(){
		NR.settings.voice_volume_def = (voice_volume_def.checked == true) ? 1 : 0;
	}, false);
	voice_volume_def.checked = (NR.settings.voice_volume_def == 1);
	// 声質（ 0:棒読みちゃん画面上の設定、1:女性1、2:女性2、3:男性1、4:男性2、5:中性、6:ロボット、7:機械1、8:機械2、10001～:SAPI5）
	var voice_type = document.getElementById('voice_type');
	voice_type.addEventListener('change', function(){
		NR.settings.voice_type = voice_type.value;
	}, false);
	voice_type.selectedIndex = NR.settings.voice_type - 1;
	// 声質-本体設定使用
	var voice_type_def = document.getElementById('voice_type_def');
	voice_type_def.addEventListener('change', function(){
		NR.settings.voice_type_def = (voice_type_def.checked == true) ? 1 : 0;
	}, false);
	voice_type_def.checked = (NR.settings.voice_type_def == 1);
	// テストトーク
	var talknow = document.getElementById('talktest');
	talknow.addEventListener('click', function(){
		var talk = document.getElementById('talk').value;
		bouyomi_talk(talk);
	}, false);

	// 今すぐチェック
	var checknow = document.getElementById('checknow');
	checknow.addEventListener('click', function(){
		NR.checkTimeLine();
	}, false);

	// 文字列のバイト数を取得
	function getBytes(text)
	{
		count = 0;
		for (i=0; i<text.length; i++)
		{
			n = escape(text.charAt(i));
			if (n.length < 4) count++; else count+=2;
		}
		return count;
	}




	// レポート設定リストの作成
	getWatchList( function(ret){
		// ユーザー/フレンドリストの作成
		userids = Array();
		// ユーザーとフレンドをまとめる
		if(ret["watchuser"] && ret["watchuser"].length > 0) userids = userids.concat(ret["watchuser"]);
		if(ret["friend"] && ret["friend"].length > 0) userids = userids.concat(ret["friend"]);
		userids = userids.unique();
		// テーブル生成
		var ta = document.createElement("table");
			// レポートリストヘッダー
			var tr = document.createElement('tr');
				var th = document.createElement('th');
				th.innerText = "/";
				th.setAttribute("class", "userlist_userheader");
				tr.appendChild(th);
				for(i=0;i<NR.types.length;i+=3) {
					if(NR.types[i+2]!=1)continue;
					th = document.createElement('th');
					th.innerHTML = "<div class='rot_container'><div class='rot90'>"+NR.types[i+1]+"<br/><span>"+NR.types[i]+"</span></div></div>";//;
					th.setAttribute("class", "userlist_header");
					tr.appendChild(th);
				}
			ta.appendChild(tr);
			// すべて設定
			var tr = document.createElement('tr');
				var th = document.createElement('th');
				th.innerText = "すべて";
				tr.appendChild(th);
				for(i=0;i<NR.types.length;i+=3) {
					if(NR.types[i+2]!=1)continue;
					td = document.createElement('td');
					td.setAttribute("class", "userlist_check");
					var ck = document.createElement('input');
					ck.type = 'checkbox';
					ck.name = 'all';
					ck.class = NR.types[i];
					ck.id = NR.types[i] + "_all";
					ck.checked = NR.getPermission(NR.types[i],"all")==1;
					ck.addEventListener('change', function(){
						var k = this.checked?1:0;
						//console.log(this.class +"-"+this.name);
						NR.setPermission(this.class,"all",k);
						// ユーザー一挙設定
						for(j=0;j<userids.length;j++) {
							NR.setPermission(this.class, userids[j],k);
							var cbbid = document.getElementById(this.class + "_" + userids[j]);
							cbbid.checked = k;
						}
					}, false);
					td.appendChild(ck);
					var lb = document.createElement('label');
					lb.setAttribute("for", NR.types[i]+"_all");
					td.appendChild(lb);
					tr.appendChild(td);
				}
			ta.appendChild(tr);
			// 新規設定
			var tr = document.createElement('tr');
				var th = document.createElement('th');
				th.innerText = "新規";
				tr.appendChild(th);
				for(i=0;i<NR.types.length;i+=3) {
					if(NR.types[i+2]!=1)continue;
					td = document.createElement('td');
					td.setAttribute("class", "userlist_check");
					var ck = document.createElement('input');
					ck.type = 'checkbox';
					ck.name = 'new';
					ck.class = NR.types[i];
					ck.id = NR.types[i] + "_new";
					ck.checked = NR.getPermission(NR.types[i],"new")==1;
					ck.addEventListener('change', function(){
						var k = this.checked;
						//console.log(this.class +"-"+this.name);
						NR.setPermission(this.class,"new",(k?1:0));
					}, false);
					td.appendChild(ck);
					var lb = document.createElement('label');
					lb.setAttribute("for", NR.types[i]+"_new");
					td.appendChild(lb);
					tr.appendChild(td);
				}
			ta.appendChild(tr);
			// ユーザー設定
			for(j=0;j<userids.length;j++) {
				var tr = document.createElement('tr');
					var th = document.createElement('th');
					var im = document.createElement("img");
					var tp = document.createElement("span");
					var id = ""+userids[j];
					var idh = NR.getIDh(id);
					tp.id = "chip_" + id;
					im.src = "http://usericon.nimg.jp/usericon/"+idh+"/"+id+".jpg";
					im.alt = id;
					im.addEventListener('mouseover', function(){
						var name  = NR.getName(this.alt);
						if(!name) name = "取得中...";
						var tp = document.getElementById("chip_" + this.alt);
						tp.innerHTML = this.alt + "<br>" + name;
						tp.style.visibility = "visible";
					}, false);
					im.addEventListener('mouseout', function(){
						var tp = document.getElementById("chip_" + this.alt);
						tp.style.visibility = "hidden";
					}, false);
					var a = document.createElement('a');
					a.href = "http://www.nicovideo.jp/user/" + userids[j];
					a.target = "_blank";
					a.setAttribute("class", "tooltip");
					a.appendChild(im)
					a.appendChild(tp);
					th.appendChild(a);
					tr.appendChild(th);
					for(i=0;i<NR.types.length;i+=3) {
						if(NR.types[i+2]!=1)continue;
						td = document.createElement('td');
						td.setAttribute("class", "userlist_check");
						
						var ck = document.createElement('input');
						ck.type = 'checkbox';
						ck.name = userids[j];
						ck.class = NR.types[i];
						ck.id = NR.types[i] + "_" + userids[j];
						ck.checked = NR.getPermission(NR.types[i],userids[j])==1;
						ck.addEventListener('change', function(){
							var k = this.checked;
							//console.log(this.class +"-"+this.name);
							NR.setPermission(this.class,this.name,(k?1:0));
						}, false);
						td.appendChild(ck);
						var lb = document.createElement('label');
						lb.setAttribute("for", NR.types[i] + "_" + userids[j]);
						td.appendChild(lb);
						tr.appendChild(td);
					}
				ta.appendChild(tr);
			}
		userlist.appendChild(ta);


		// コミュニティ/チャンネルリストの作成
		commids = Array();
		// コミュニティとチャンネルをまとめる
		if(ret["channel_id"] && ret["channel_id"].length > 0) commids = commids.concat(ret["channel_id"]);
		if(ret["community_id"] && ret["community_id"].length > 0) commids = commids.concat(ret["community_id"]);
		commids = commids.unique();
		// テーブル生成
		var ta = document.createElement("table");
			// レポートリストヘッダー
			var tr = document.createElement('tr');
				var th = document.createElement('th');
				th.innerText = "/";
				th.setAttribute("class", "commlist_commheader");
				tr.appendChild(th);
				for(i=0;i<NR.types.length;i+=3) {
					if(NR.types[i+2]!=3)continue;
					th = document.createElement('th');
					th.innerHTML = "<div class='rot_container'><div class='rot90'>"+NR.types[i+1]+"<br/><span>"+NR.types[i]+"</span></div></div>";//;
					th.setAttribute("class", "commlist_header");
					tr.appendChild(th);
				}
			ta.appendChild(tr);
			// すべて設定
			var tr = document.createElement('tr');
				var th = document.createElement('th');
				th.innerText = "すべて";
				tr.appendChild(th);
				for(i=0;i<NR.types.length;i+=3) {
					if(NR.types[i+2]!=3)continue;
					td = document.createElement('td');
					td.setAttribute("class", "commlist_check");
					var ck = document.createElement('input');
					ck.type = 'checkbox';
					ck.name = 'all';
					ck.class = NR.types[i];
					ck.id = NR.types[i] + "_all";
					ck.checked = NR.getPermission(NR.types[i],"all")==1;
					ck.addEventListener('change', function(){
						var k = this.checked?1:0;
						//console.log(this.class +"-"+this.name);
						NR.setPermission(this.class,"all",k);
						
						// コミュニティー一挙設定
						for(j=0;j<commids.length;j++) {
							NR.setPermission(this.class, "co"+commids[j],k);
							var cbbid = document.getElementById(this.class + "_co" + commids[j]);
							cbbid.checked = k;
						}
						
					}, false);
					td.appendChild(ck);
					var lb = document.createElement('label');
					lb.setAttribute("for", NR.types[i]+"_all");
					td.appendChild(lb);
					tr.appendChild(td);
				}
			ta.appendChild(tr);
			// 新規設定
			var tr = document.createElement('tr');
				var th = document.createElement('th');
				th.innerText = "新規";
				tr.appendChild(th);
				for(i=0;i<NR.types.length;i+=3) {
					if(NR.types[i+2]!=3)continue;
					td = document.createElement('td');
					td.setAttribute("class", "commlist_check");
					var ck = document.createElement('input');
					ck.type = 'checkbox';
					ck.name = 'new';
					ck.class = NR.types[i];
					ck.id = NR.types[i] + "_new";
					ck.checked = NR.getPermission(NR.types[i],"new")==1;
					ck.addEventListener('change', function(){
						var k = this.checked;
						//console.log(this.class +"-"+this.name);
						NR.setPermission(this.class,"new",(k?1:0));
					}, false);
					td.appendChild(ck);
					var lb = document.createElement('label');
					lb.setAttribute("for", NR.types[i]+"_new");
					td.appendChild(lb);
					tr.appendChild(td);
				}
			ta.appendChild(tr);
			// コミュニティー設定
			for(j=0;j<commids.length;j++) {
				var tr = document.createElement('tr');
					var th = document.createElement('th');
					var im = document.createElement("img");
					var tp = document.createElement("span");
					var id = "co"+commids[j];
					var idh = NR.getIDh(""+commids[j]);
					tp.id = "chip_" + id;
					im.src = "http://icon.nimg.jp/community/"+idh+"/"+id+".jpg";
					im.alt = id;
					im.addEventListener('mouseover', function(){
						var name  = NR.getName(this.alt);
						if(!name) name = "取得中...";
						var tp = document.getElementById("chip_" + this.alt);
						tp.innerHTML = this.alt + "<br>" + name;
						tp.style.visibility = "visible";
					}, false);
					im.addEventListener('mouseout', function(){
						var tp = document.getElementById("chip_" + this.alt);
						tp.style.visibility = "hidden";
					}, false);
					var a = document.createElement('a');
					a.href = "http://com.nicovideo.jp/community/co" + commids[j];
					a.target = "_blank";
					a.setAttribute("class", "tooltip");
					a.appendChild(im);
					a.appendChild(tp);
					th.appendChild(a);
					tr.appendChild(th);
					for(i=0;i<NR.types.length;i+=3) {
						if(NR.types[i+2]!=3)continue;
						td = document.createElement('td');
						td.setAttribute("class", "commlist_check");
						var ck = document.createElement('input');
						ck.type = 'checkbox';
						ck.name = "co"+commids[j];
						ck.class = NR.types[i];
						ck.id = NR.types[i] + "_co" + commids[j];
						ck.checked = NR.getPermission(NR.types[i],"co"+commids[j])==1;
						ck.addEventListener('change', function(){
							var k = this.checked;
							//console.log(this.class +"-"+this.name);
							NR.setPermission(this.class,this.name,(k?1:0));
						}, false);
						td.appendChild(ck);
						var lb = document.createElement('label');
						lb.setAttribute("for", NR.types[i] + "_co" + commids[j]);
						td.appendChild(lb);
						tr.appendChild(td);
					}
				ta.appendChild(tr);
			}
		commlist.appendChild(ta);
	});



	// ウォッチリストの取得
	function getWatchList(handler) {
		NR.request.onreadystatechange = function() {
			if(NR.request.readyState == 4 && NR.request.status == 200) {
				var ret = JSON.parse(NR.request.responseText);
				if(handler) handler(ret);
			}
		};
		NR.request.open("GET", "http://flapi.nicovideo.jp/api/getchecklist", true);
		NR.request.send();
	}



/*
	var request = new XMLHttpRequest();
	// ニコレポページの取得
	function getNicorepo(handler) {
		request.onreadystatechange = function() {
			console.log("onload");//+request.readyState+"---"+request.status);
			if(request.readyState == 4 && request.status == 200) {
				var ret = request.responseXML;
				console.log("geted"+ret);
				if(handler) handler(ret);
			}
		};
		request.open("GET", "http://www.nicovideo.jp/my/top/all?innerPage=1&mode=next_page", true);
		request.responseType = "document";
		request.send();
		console.log("sended");
	}

	getNicorepo( function(ret){
		console.log("get");
		var logs = ret.getElementsByClassName("log");
		for(i=0;i<logs.length;i++) {
			console.log("logtest:"+logs[i]);
		}
	});	
	
*/



}, false);


