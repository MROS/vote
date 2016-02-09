var Vue = require('../bower_components/vue/dist/vue.js');
Vue.use(require('../bower_components/vue-resource/dist/vue-resource.js'));

var vm = new Vue({
	el: '#voting',
	data: {
		title: '',
		choices: [
		],
		selected: [],
		username: '?'
	},
	ready: function() {
		var index = window.location.pathname.substring(3);
		this.$http.get('/data/' + index).then(
			function (response) {
				console.log(response);
				this.title = response.data.title;
				this.choices = response.data.choices;
				this.selected = response.data.selected;
				this.username = response.data.need_name ? response.data.username : '?';
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
				console.log(this.selected)
				var id = this.selected.indexOf(target.name);
				var data;
				if (id >= 0) { // indexOf在找不到目標時回傳-1
					target.voters.splice(this.username, 1);

					data = JSON.stringify({type: "remove", name: target.name})
				} else {
					target.voters.push(this.username);

					data = JSON.stringify({type: "add", name: target.name})
				}

				var index = window.location.pathname.substring(3);
				this.$http.post('/update/' + index, data).then(
					function (response) {
						console.log("update successfully");
					},
					function (response) {
						console.log("update error");
					}
				);
			}
		}
	}
})
