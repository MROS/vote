var Vue = require('../bower_components/vue/dist/vue.js');
Vue.use(require('../bower_components/vue-resource/dist/vue-resource.js'));
var header = require('./header.js').header;

Vue.component('my-header', header)

new Vue({
	el: '#main',
	data: {
		title: '',
		username: '',
		new_choice: '',
		choices: [],
		multi_select: '',
		need_name: '',
		need_login: '',
		alert: false,
		is_login: false,
		is_loaded: true
	},
	ready: function(){
		this.$http.get('/is_auth').then(
			function (response) {
				if (response.data.res == false) {
					this.is_login = false;
				} else {
					this.is_login = true;
					this.username = response.data.name;
				}
			},
			function (response) {
				console.log("response error");
			}
		);
	},
	methods: {
		submit: function () {
			// TODO: 需要更強的檢查
			var needed = [this.title, this.multi_select, this.need_name, this.need_login];
			for (var i of needed) {
				if (i == '') {
					this.alert = true;
					return;
				}
			}
			if (this.choices.length <= 0) {
				this.alert = true;
				return;
			}

			data = {
				title: this.title,
				multi_select: this.multi_select == "複選" ? true : false,
				need_name: this.need_name == "yes" ? true : false,
				need_login: this.need_login == "yes" ? true : false,
				choices: this.choices
			};
			console.log(JSON.stringify(data))
			this.$http.post('/create', JSON.stringify(data)).then(
				function(response) {
					var url = response.data.url;
					window.location.pathname = url;
				},
				function() {}
			);
		},
		add: function() {
			console.log(this.$children)
			this.choices.push(this.new_choice);
			this.new_choice = '';
		},
		remove: function(index) {
			this.choices.splice(index, 1)
		},
		hide_alert: function() {
			this.alert = false;
		}
	}
})
