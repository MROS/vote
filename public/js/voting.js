var Vue = require('../bower_components/vue/dist/vue.js');
Vue.use(require('../bower_components/vue-resource/dist/vue-resource.js'));

new Vue({
	el: '#voting',
	data: {
		title: 'jjj',
	},
	http: {
		root: '/',
		headers: {
			Authorization: 'Basic YXBpOnBhc3N3b3Jk'
		}
	},
	ready: function() {
		this.$http.get('/data').then(
			function (response) {
				console.log(response);
				this.title = response.data.title;
			},
			function (response) {
				console.log("response error");
			}
		);
	},
	methods: {
	}
})
