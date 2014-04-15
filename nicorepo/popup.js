window.onload = function(){
	var data = JSON.parse(window.location.hash.substr(1));
	document.getElementById("icon").src = data.nico;
	document.getElementById("message").innerHTML = data.nmsg;
	document.getElementById("name").innerHTML = data.name;
	document.getElementById("title").innerHTML = data.title;
	document.getElementById("time").innerHTML = data.time;
	document.getElementById("info").style.backgroundColor = data.pbc;
}
