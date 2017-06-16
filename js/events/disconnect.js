const main = require('../../eye.js');

main.client.on('disconnect', async (closeEvent) => {
	if (closeEvent.code === 1000) {
		process.exit();
	}
});
