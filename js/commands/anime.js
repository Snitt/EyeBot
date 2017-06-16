const main = require('../../eye.js');
const fs = require('fs');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	anime(message, args);
}

function anime(message, args) {
	if (message.channel.type === 'text' && message.channel.nsfw === false) { util.errorReply(message.channel, `This Command May Only Be Used In A NSFW Channel!`, main.variables.default_delete); return; }
	let randomId = Math.floor((Math.random() * 2000000));

	main.snekfetch.get(`http://danbooru.donmai.us/posts.json?limit=1&random=true`)
	.then((response) => {
		let body = response.body;

		main.snekfetch.get(`http://danbooru.donmai.us/${body[0].file_url}`)
		.then((_response) => {
			fs.writeFile(`${message.id}.jpg`, _response.body, (error) => {
				message.channel.send({file: `${message.id}.jpg`})
				.then((_message) => {
					fs.unlink(`${message.id}.jpg`, (error) => {

					})
				})
			})
		})
		.catch((_response) => { anime(message, args); console.log(_response.body); })
	})
	.catch((response) => { anime(message, args); console.log(response.body); })
}
