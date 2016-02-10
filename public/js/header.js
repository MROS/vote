var Vue = require('../bower_components/vue/dist/vue.js');

var header = Vue.extend({
	props: ['is_login'],
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
					</template>
					<template v-else>
						<a class="button" href="/auth/facebook"><span class="icon"><i class="fa fa-facebook-official"></i></span> 登入</a>
					</template>
				</span>
			</div>
		</div>
	</header>
	`
})

module.exports = {
	header: header
}
