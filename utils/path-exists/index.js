const fs = require('fs')

async function pathExists(path) {
	try {
		await fs.promises.access(path);
		return true;
	} catch {
		return false;
	}
}

function pathExistsSync(path) {
	try {
		fs.accessSync(path);
		return true;
	} catch {
		return false;
	}
}

module.exports = {
  pathExists,
  pathExistsSync
}