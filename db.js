var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/voting');

var Voting = mongoose.model(
	'voting',
	{
		index: String,
		title: String,
		multi_select: Boolean,
		need_name: Boolean,
		need_login: Boolean,
		choices: [
			{name: String, voters: [{user: String, id: String}]}
		]
	}
);

var User = mongoose.model(
	'user',
	{
		id: String,
		name: String,
	}
)

module.exports = {
	Voting: Voting,
	User: User
}
