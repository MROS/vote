var path = require('path');
var config = {
	entry: {
		voting: path.resolve(__dirname, 'js/voting.js'),
		index: path.resolve(__dirname, 'js/index.js'),
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
			}
		]
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.common.js'
			}
	}

};
module.exports = config;