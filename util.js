module.exports = {
	random_url: function () {
		var url = "";
		for (var i = 0; i < 16; i++) {
			url += String.fromCharCode(97 + Math.floor((Math.random() * 26)));
		}
		return url;
	}
}
