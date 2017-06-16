const main = require('../../eye.js');

const util = require('../util.js');

module.exports.command = function(message, args) {
	catfact(message, args);
}

function catfact(message, args) {
	main.snekfetch.get('http://catfacts-api.appspot.com/api/facts')
	.then((response) => {
		util.successReply(message.channel, `\*\*Random Cat Fact:\*\* ${JSON.parse(response.text).facts[0]}`, null);
	})
	.catch((response) => console.log(response.body))
}
