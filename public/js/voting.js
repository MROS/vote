var Vue = require('vue');
Vue.use(require('vue-resource'));
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
				this.need_name = response.data.need_name;
				this.need_login = response.data.need_login;
				this.is_login = response.data.is_login;
				this.multi_select = response.data.multi_select;
				this.fb_name = response.data.fb_name;
				this.username = response.data.need_name ? response.data.username : '';
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
		},
		show_warning: function() {
			return this.need_login && !this.is_login
		}
	},
	mounted: get_data(false, false),
	methods: {
		turn_on_changing: function() {
			this.changing_name = true;
			Vue.nextTick(function(){
				this.$refs.name_input.focus();
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
			var myChoice = null;
			for (let choice of this.choices) {
				if (choice.name == item) {
					myChoice = choice;
				}
			}
			if (myChoice != null) {
				var data;
				if (myChoice.selected) {
					myChoice.voters.splice(this.username, 1);
					data = JSON.stringify({type: "remove", name: myChoice.name})
				} else {
					myChoice.voters.push(this.username);
					data = JSON.stringify({type: "add", name: myChoice.name})
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
