var Vue = require('../bower_components/vue/dist/vue.js');
Vue.use(require('../bower_components/vue-resource/dist/vue-resource.js'));

new Vue({
	el: '#voting',
	data: {
		title: '',
		choices: [
		],
		selected: []
	},
	ready: function() {
		var index = window.location.pathname.substring(3);
		this.$http.get('/data/' + index).then(
			function (response) {
				console.log(response);
				this.title = response.data.title;
				this.choices = response.data.choices;
			},
			function (response) {
				console.log("response error");
			}
		);
	},
	methods: {
		select: function(item, event) {
			var target = null;
			for (i of this.choices) {
				if (i.name == item) {
					target = i;
				}
			}
			if (target != null) {
				console.log(event);
				var id = this.selected.indexOf(target.name);
				if (id >= 0) { // indexOf在找不到目標時回傳-1
					target.voters.splice("kk", 1);
				} else {
					target.voters.push("kk");
				}
			}
		}
	}
})
