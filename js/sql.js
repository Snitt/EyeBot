const mysql = require('mysql');
const main = require('../eye.js');

var pool = mysql.createPool({
	host	: main.variables.database_host,
	user	: main.variables.database_user,
	password: main.variables.database_pass,
	database: main.variables.database_user
})

module.exports.pool = pool;

module.exports.query = function(query) {
	return new Promise((resolve, reject) => {
		pool.getConnection((poolError, connection) => {
			if (poolError) { console.log(poolError); reject(poolError); }

			connection.query(query, (queryError, results, fields) => {
				connection.release();
				if (queryError) reject(queryError);

				resolve(results);
			})
		})
	})
}

module.exports.insertUser = `INSERT INTO users VALUES ('0', '?');`;
module.exports.insertGuild = `INSERT INTO guilds VALUES ('0', '?', '?', '?', '?', '?', '?', '');`;
module.exports.insertChannel = `INSERT INTO channels VALUES ('0', '%s', '%s');`;
module.exports.insertPoints = `INSERT INTO userguilds VALUES ('0', '%s', '%s', '%s');`;
module.exports.insertWordFilter = `INSERT INTO wordfilter VALUES ('0', '%s', '%s');`;

module.exports.updatePrefix = `UPDATE guilds SET prefix = '%s' WHERE id = '%s';`;
module.exports.updateTwitchChannel = `UPDATE guilds SET twitch_defaultchannel = '%s' WHERE id = '%s';`;

module.exports.removePrefix = `DELETE FROM wordfilter WHERE id = '%s';`;
