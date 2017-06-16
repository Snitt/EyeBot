const main = require('../../eye.js');
const fs = require('fs');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	dog(message, args);
}

function dog(message, args) {
	main.snekfetch.get(`https://random.dog/woof.json`)
	.then((response) => {
		main.snekfetch.get(response.body.url)
		.then((_response) => {
			fs.writeFile(`${message.id}.jpg`, _response.body, (error) => {
				message.channel.send({file: `${message.id}.jpg`})
				.then((_message) => {
					fs.unlink(`${message.id}.jpg`, (error) => {

					})
				})
			})
		})
	})
}
