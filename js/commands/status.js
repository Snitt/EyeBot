const main = require('../../eye.js');

const os = require('os');
const pm2 = require('pm2');
const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	status(message, args);
}

function status(message, args) {
	pm2.describe("eye", (error, data) => {
		reply = `\*\*Status Command\*\*\n`
		+ `\n\*\*Memory:\*\* Used [${(process.memoryUsage().rss / 1048576).toFixed(2)} Mb] - Data [${(process.memoryUsage().heapUsed / 1048576).toFixed(2)} Mb] - Used (${((os.freemem() / os.totalmem()) * 100).toFixed(3)}%)`
		+ `\n\*\*CPU Usage:\*\* ${data[0].monit.cpu}%`
		+ `\n\*\*Server Uptime:\*\* ${util.timeToHuman(os.uptime())}`
		+ `\n\*\*Process Uptime:\*\* ${util.timeToHuman(process.uptime())}`
		+ `\n\n\*\*Users:\*\* ${main.client.users.size} | \*\*Guilds:\*\* ${main.client.guilds.size} | \*\*Channels:\*\* ${main.client.channels.size}`
		+ `\n\*\*Bot Version:\*\* ${main.variables.version} | \*\*Node Version:\*\* ${process.versions.node}`;

		util.successReply(message.channel, reply, null);
	});
}
