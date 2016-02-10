var Vue = require('../bower_components/vue/dist/vue.js');

var header = Vue.extend({
	props: ['is_login', 'username'],
	template: `
	<header class="header">
		<div class="container">
			<!-- Left side -->
			<div class="header-left">
				<a class="header-item" href="/">
					投票
				</a>
			</div>
			<div class="header-right header-menu">
				<span class="header-item">
					<template v-if="is_login">
						{{username}}
						<a id="sign-out" class="button" href="/logout">
							<span class="icon"><i class="fa fa-sign-out"></i></span>
						</a>
					</template>
					<template v-else>
						<a v-on:click="store_path" class="button" href="/auth/facebook"><span class="icon"><i class="fa fa-facebook-official"></i></span> 登入</a>
					</template>
				</span>
			</div>
		</div>
	</header>
	`,
	methods: {
		store_path: function() {
			console.log("save")
			localStorage.setItem("last_path", window.location.pathname);
		}
	}
})

module.exports = {
	header: header
}
