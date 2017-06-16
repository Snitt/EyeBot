const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	trump(message, args);
}

function trump(message, args) {
	main.snekfetch.get(`https://api.whatdoestrumpthink.com/api/v1/quotes/random`)
	.then((response) => {
		util.successReply(message.channel, `\*\*Random Trump Quote:\*\* ${response.body.message}`, null);
	})
	.catch((response) => { console.log(response.body); })
}
