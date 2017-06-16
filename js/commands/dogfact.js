const main = require('../../eye.js');

const util = require('../util.js');

module.exports.command = function(message, args) {
	dogfact(message, args);
}

function dogfact(message, args) {
	main.snekfetch.get('http://dog-api.kinduff.com/api/facts')
	.then((response) => {
		util.successReply(message.channel, `\*\*Random Dog Fact:\*\* ${JSON.parse(response.text).facts[0]}`, null);
	})
	.catch((response) => console.log(response.body))
}
