var Vue = require('../bower_components/vue/dist/vue.js');
Vue.use(require('../bower_components/vue-resource/dist/vue-resource.js'));

var get_data = function(long_polling) {
	return function() {
		var index = window.location.pathname.substring(3);
		var url = (long_polling ? '/poll/' : '/data/') + index;
		this.$http.get(url).then(
			function (response) {
				console.log(response);
				this.title = response.data.title;
				this.choices = response.data.choices;
				this.selected = response.data.selected;
				this.username = response.data.need_name ? response.data.username : '';
				get_data(true).call(this);
			},
			function (response) {
				console.log("response error");
			}
		);
	};
}

var vm = new Vue({
	el: '#voting',
	data: {
		title: '',
		choices: [
		],
		selected: [],
		username: '',
		changing_name: false,
		typing_name: '',
	},
	computed: {
		display_name: function() {
			if (this.username == '') {
				return "未命名";
			} else {
				return this.username;
			}
		}
	},
	ready: get_data(false),
	methods: {
		switch_changing: function() {
			this.changing_name = !this.changing_name;
		},
		change_name: function() {
			this.username = this.typing_name;
			this.typing_name = "";
			this.changing_name = false;
		},
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
