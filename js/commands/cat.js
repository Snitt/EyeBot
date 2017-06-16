const main = require('../../eye.js');
const fs = require('fs');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	cat(message, args);
}

function cat(message, args) {
	main.snekfetch.get(`http://random.cat/meow`)
	.then((response) => {
		main.snekfetch.get(response.body.file)
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
