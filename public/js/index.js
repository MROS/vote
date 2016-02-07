new Vue({
	el: '#setting',
	data: {
		title: '',
		new_choice: '',
		choices: [],
		one_or_many: '',
		need_name: '',
		need_login: ''
	},
	methods: {
		submit: function () {
			console.log(this.title);
			console.log(this.new_choice);
			console.log(this.choices);
			console.log(this.one_or_many);
			console.log(this.need_login);
			console.log(this.need_name);
		},
		add: function() {
			this.choices.push(this.new_choice);
			this.new_choice = '';
		},
		remove: function(index) {
			this.choices.splice(index, 1)
		}
	}
})
