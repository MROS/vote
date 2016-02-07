new Vue({
	el: '#setting',
	data: {
		title: '',
		new_choice: '',
		choices: [],
		one_or_many: '',
		need_name: '',
		need_login: '',
		alert: false
	},
	methods: {
		submit: function () {
			// TODO: 需要更強的檢查
			var needed = [this.title, this.one_or_many, this.need_name, this.need_login];
			for (var i of needed) {
				if (i == '') {
					this.alert = true;
					return;
				}
			}
			if (choices.length = 1) {
				this.alert = true;
				return;
			}
		},
		add: function() {
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
