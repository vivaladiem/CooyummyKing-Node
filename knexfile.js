// Update with your config settings.

var db = require('./config/development.json').db;
module.exports = {

	development: {
		client: 'mysql',
		connection: {
			host: db.host,
			database: db.database,
			user: db.username,
			password: db.password,
			charset: db.charset
		}
	},

	staging: {
		client: 'mysql',
		connection: {
			host: db.host,
			database: db.database,
			user:     db.username,
			password: db.password,
			charset: db.charset
		}
	},

	production: {
		client: 'mysql',
		connection: {
			host: db.host,
			database: db.database,
			user:     db.username,
			password: db.password,
			charset: db.charset
		}
	}
};
