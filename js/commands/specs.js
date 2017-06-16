const main = require('../../eye.js');

const os = require('os');
const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	specs(message, args);
}

function specs(message, args) {
	let cpu = os.cpus();

	reply = `\*\*Specs Command\*\*\n`
	+ `\n\*\*CPU Model:\*\* ${cpu[0].model} (${Object.keys(cpu).length} Cores)`
	+ `\n\*\*Platform:\*\* ${os.type()} ${os.arch()} (${os.release()})`;

	util.successReply(message.channel, reply, null);
}
