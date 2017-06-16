const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	help(message, args);
}

function help(message, args) {
	reply = `\*\*Help Command\*\*\n`;

	if (args.length === 0) {
		reply += `\nWelcome To Temp Help Placeholder`
		+ `\nTo See Commands Type: \*\*help list\*\*`;

		if (message.channel.type === 'text') {
			reply += `\n\n\*\*Guild Prefix:\*\* \`\`${data.guilds[message.guild.id].vars.prefix}\`\``;
		}

		reply += `\n\n\*\*Official Support Server:\*\* https://discord.io/eyebot`
	} else if (args.length === 1) {
		if (args[0] === 'list') {
			reply += `\`\`\``;

			for (command in main.commands) {
				if (main.commands[command].subcommands !== undefined) {
					reply += `${command} - \*More\*`;
				} else {
					reply += `${command}`;
				}

				if (main.commands[command].enabled === false) {
					reply += ` (Disabled)`;
				}

				reply += `\n`;
			}

			reply += `\`\`\``;
		} else {
			if (main.commands[args[0]] === undefined) { util.errorReply(message.channel, `Cannot Find This Command!`, null); return; }

			if (main.commands[args[0]].subcommands !== undefined) {
				reply += `\`\`\``;

				for (command in main.commands[args[0]].subcommands) {
					if (main.commands[args[0]].subcommands[command].subcommands !== undefined) {
						reply += `${args[0]} ${command} - \*More\*`;
					} else {
						reply += `${args[0]} ${command}`;
					}

					if (main.commands[args[0]].subcommands[command].enabled === false) {
						reply += ` (Disabled)`;
					}

					reply += `\n`;
				}

				reply += `\`\`\``;
			} else {
				reply += `\n\*\*Command:\*\* ${args[0]}`
				+ `\n\*\*Description:\*\* ${main.commands[args[0]].description}`
				+ `\n\*\*Access:\*\* ${main.commands[args[0]].access} | \*\*Channel Type:\*\* ${main.commands[args[0]].type}`
				+ `\n\n\*\*Usage:\*\* ${main.commands[args[0]].usage}`
			}
		}
	} else if (args.length === 2) {
		if (main.commands[args[0]] === undefined) { util.errorReply(message.channel, `Cannot Find This Command!`, null); return; }

		if (main.commands[args[0]].subcommands[args[1]] === undefined) {
			let errorReply = `Cannot Find This Command! Below are available sub-commands for \*\*${args[0]}\*\*`
			+ `\n\`\`\``;

			for (command in main.commands[args[0]].subcommands) {
				errorReply += `${command}, `;
			}

			errorReply += `\`\`\``;
			util.errorReply(message.channel, errorReply.channel, null); return;
		}

		if (main.commands[args[0]].subcommands[args[1]].subcommands !== undefined) {
			reply += `\`\`\``;

			for (command in main.commands[args[0]].subcommands[args[1]].subcommands) {
				reply += `${args[0]} ${args[1]} ${command}`;

				if (main.commands[args[0]].subcommands[args[1]].subcommands[command].enabled === false) {
					reply += ` (Disabled)`;
				}

				reply += `\n`;
			}

			reply += `\`\`\``;
		} else {
			reply += `\n\*\*Command:\*\* ${args[0]} ${args[1]}`
			+ `\n\*\*Description:\*\* ${main.commands[args[0]].subcommands[args[1]].description}`
			+ `\n\*\*Access:\*\* ${main.commands[args[0]].subcommands[args[1]].access} | \*\*Channel Type:\*\* ${main.commands[args[0]].subcommands[args[1]].type}`
			+ `\n\n\*\*Usage:\*\* ${main.commands[args[0]].subcommands[args[1]].usage}`
		}
	} else if (args.length === 3) {
		if (main.commands[args[0]] === undefined) { util.errorReply(message.channel, `Cannot Find This Command!`, null); return; }

		if (main.commands[args[0]].subcommands[args[1]] === undefined) {
			let errorReply = `Cannot Find This Command! Below are available sub-commands for \`\`${args[0]}\`\``
			+ `\n\`\`\``;

			for (command in main.commands[args[0]].subcommands) {
				errorReply += `${command}, `;
			}

			errorReply += `\`\`\``;
			util.errorReply(message.channel, errorReply, null); return;
		}

		if (main.commands[args[0]].subcommands[args[1]].subcommands[args[2]] === undefined) {
			let errorReply = `Cannot Find This Command! Below are available sub-commands for \`\`${args[0]} ${args[1]}\`\``
			+ `\n\`\`\``;

			for (command in main.commands[args[0]].subcommands[args[1]].subcommands) {
				errorReply += `${command}, `;
			}

			errorReply += `\`\`\``;
			util.errorReply(message.channel, errorReply, null); return;
		}

		if (main.commands[args[0]].subcommands[args[1]].subcommands[args[2]].subcommands !== undefined) {
			reply = `\`\`\``;

			for (command in main.commands[args[0]].subcommands[args[1]].subcommands[args[2]].subcommands) {
				reply += `${args[0]} ${args[1]} ${args[2]} ${command}\n`;
			}

			reply += `\`\`\``;
		} else {
			reply = `Here You Go!\n\n\*\*Command:\*\* ${args[0]} ${args[1]} ${args[2]}`
			+ `\n\*\*Description:\*\* ${main.commands[args[0]].subcommands[args[1]].subcommands[args[2]].description}`
			+ `\n\*\*Access:\*\* ${main.commands[args[0]].subcommands[args[1]].subcommands[args[2]].access} | \*\*Channel Type:\*\* ${main.commands[args[0]].subcommands[args[1]].subcommands[args[2]].type}`
			+ `\n\n\*\*Usage:\*\* ${main.commands[args[0]].subcommands[args[1]].subcommands[args[2]].usage}`
		}
	} else {
		reply = `There is no command this long...`;
	}

	message.author.send(reply)
	.catch((error) => {
		util.successReply(message.channel, reply, null);
	})
}
