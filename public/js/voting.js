var Vue = require('../bower_components/vue/dist/vue.js');
Vue.use(require('../bower_components/vue-resource/dist/vue-resource.js'));
var header = require('./header.js').header;

Vue.component('my-header', header);

var get_data = function(long_polling, once) {
	return function() {
		var index = window.location.pathname.substring(3);
		var url = (long_polling ? '/poll/' : '/data/') + index;
		this.$http.get(url).then(
			function (response) {
				console.log(response.data);
				this.title = response.data.title;
				this.choices = response.data.choices;
				this.selected = response.data.selected;
				this.need_name = response.data.need_name;
				this.need_login = response.data.need_login;
				this.is_login = response.data.is_login;
				this.multi_select = response.data.multi_select;
				this.username = response.data.need_name ? response.data.username : '';
				this.fb_name = response.data.fb_name;
				if (!once) {
					get_data(true, false).call(this);
				}
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
		multi_select: null,
		need_name: null,
		need_login: null,
		is_login: true,
		fb_name: ''
	},
	computed: {
		about_setting: function() {
			var str = ""
			console.log(this.multi_select)
			str += (this.need_name ? '#記名 ' : '#匿名 ')
			str += (this.need_login ? '#需登入 ' : '#不需登入 ')
			str += (this.multi_select ? '#複選' : '#單選')
			return str;
		},
		display_name: function() {
			if (this.username == null || this.username == '') {
				return "未命名";
			} else {
				return this.username;
			}
		},
		show_input: function() {
			if (this.changing_name == true || this.username == null || this.username == '') {
				return true;
			}
			return false;
		}
	},
	ready: get_data(false, false),
	methods: {
		turn_on_changing: function() {
			this.changing_name = true;
			Vue.nextTick(function(){
				console.log(this.$els)
				this.$els.name_input.focus();
			}.bind(this))
		},
		turn_off_changing: function() {
			this.changing_name = false;
		},
		change_name: function() {
			if (this.typing_name == "") {return;}
			this.username = this.typing_name;
			this.typing_name = "";
			this.changing_name = false;
			this.$http.post("/change_username/" + this.username).then(
				function(response){
					get_data(false, true).call(this);
				},
				function(response){}
			)
		},
		select: function(item, event) {
			if (this.need_name && (this.username == null || this.username == "")) {
				event.preventDefault();
				return;
			}
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
