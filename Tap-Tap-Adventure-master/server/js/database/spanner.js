/* global log */

var cls = require('../lib/class'),
	Creator = require('./spannerCreator'), // TODO:
	_ = require('underscore'),
	Loader = require('./spannerLoader'); // TODO:
const Spanner = require('@google-cloud/spanner'); // TODO:


module.exports = GoogleSpanner = cls.Class.extend({

	init: function(projectId, instanceId, databaseId) {
		var self = this;

		/**
		 * Main file for GoogleSpanner, it splits into Creator and Loader.
		 * Responsible for creating and loading data, respectively.
		 */

		self.spanner = Spanner({
			projectId: projectId
		});

		self.instance = self.spanner.instance(instanceId);
		self.database = self.instance.database(databaseId);

		self.loader = null;

		self.testConnection(true, false);

		self.loadCreator();
		self.loadCallbacks();

	},

	testConnection: function(usingDB, forceCallbacks) {
		var self = this;

		const query = {
			sql: 'SELECT 1'
		};

		self.database.run(query).then(function(results) {
			// Results[0] should be the number of rows?
			exists = results[0];

			if(exists === 0)
				log.info('[GoogleSpanner] Test connection to database: ' + self.databaseId + ' successful.');
		});

/*
		self.connection = mysql.createConnection({
			host: self.host,
			port: self.port,
			user: self.user,
			password: self.password,
			database: usingDB ? self.database : null
		});
*/
		if (forceCallbacks)
			self.loadCallbacks();
	},

	loadCallbacks: function() {
		var self = this;

		self.connection.connect(function(err) {
			if (err) {
				log.info('[GoogleSpanner] No database found...');
				//self.testConnection(false, false);
				self.loadDatabases();
				return;
			}

			self.creator.createTables();
			log.info('[GoogleSpanner] Successfully established connection to the GoogleSpanner database!');
			self.loader = new Loader(self.database);
		});
/*
		self.connection.on('error', function(error) {
			log.error('MySQL database disconnected.');

			self.connect(true, true);
		});
*/
		self.onSelected(function() {
			self.creator.createTables();
		});
	},

	loadCreator: function() {
		var self = this;

		if (self.creator)
			return;

		self.creator = new Creator(self.database);
	},

	login: function(player) {
		var self = this,
			found;

		log.info('Initiating login for: ' + player.username);

		const query = {
			sql: 'SELECT * FROM `player_data`, `player_equipment` WHERE `player_data`.`username`= ' + player.username // terrrrible
		};

		self.database.run(query).then(function(results) {
			_.each(results, function(row) {
				if (row.username === player.username) {
					found = true;

					var data = row;

					data.armour = data.armour.split(',').map(Number);
					data.weapon = data.weapon.split(',').map(Number);
					data.pendant = data.pendant.split(',').map(Number);
					data.ring = data.ring.split(',').map(Number);
					data.boots = data.boots.split(',').map(Number);

					player.load(data);
					player.intro();
				}
			});

			if (!found)
				self.register(player);
		}).catch(function(err) {
			log.error(err);
			throw err;
		});
/*
		self.connection.query('SELECT * FROM `player_data`, `player_equipment` WHERE `player_data`.`username`= ? ', [player.username],  function(error, rows, fields) {

			if (error) {
				log.error(error);
				throw error;
			}

			_.each(rows, function(row) {
				if (row.username === player.username) {
					found = true;

					var data = row;

					data.armour = data.armour.split(',').map(Number);
					data.weapon = data.weapon.split(',').map(Number);
					data.pendant = data.pendant.split(',').map(Number);
					data.ring = data.ring.split(',').map(Number);
					data.boots = data.boots.split(',').map(Number);

					player.load(data);
					player.intro();
				}
			});

			if (!found)
				self.register(player);
		});
*/
	},

	register: function(player) {
		var self = this;

		const query = {
			sql: 'SELECT * FROM `player_data` WHERE `player_data`.`username`= ' + player.username // terrrrible
		};

		self.database.run(query).then(function(results) {
			var exists;

			_.each(results, function(row) {
				if (row.name === player.username)
					exists = true;
			});

			if (!exists) {
				log.info('No player data found. Creating new player data for: ' + player.username);

				player.isNew = true;
				player.load(self.creator.getPlayerData(player));

				self.creator.save(player);

				player.isNew = false;
				player.intro();
			}
		}).catch(function(err) {
			log.error(err);
			throw err;
		});
/*
		self.connection.query('SELECT * FROM `player_data` WHERE `player_data`.`username`= ?', [player.username], function(error, rows, fields) {
			var exists;

			_.each(rows, function(row) {
				if (row.name === player.username)
					exists = true;
			});

			if (!exists) {
				log.info('No player data found. Creating new player data for: ' + player.username);

				player.isNew = true;
				player.load(self.creator.getPlayerData(player));

				self.creator.save(player);

				player.isNew = false;
				player.intro();
			}
		});
*/
	},


	delete: function(player) {
		var self = this,
			databases = ['player_data', 'player_equipment', 'player_inventory', 'player_abilities', 'player_bank', 'player_quests', 'player_achievements'];

		// Go through all the tables to delete player data
		_.each(databases, function(db) {
			const query = 'DELETE FROM `' + db + '` WHERE `' + db + '`.`' + 'username`=' + player.username; // omg kill this

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
				log.error('Error while deleting user: ' + player.username);
			});
/*
			self.connection.query('DELETE FROM `' + db + '` WHERE `' + db + '`.`' + 'username`=?',[player.username], function(error) {
				if (error)
					log.error('Error while deleting user: ' + player.username);
			});
*/
		});
	},

	// TODO: Determine if this is even necessary if we're going to run the python script
	loadDatabases: function() {
		var self = this;

		log.info('[GoogleSpanner] Creating database....');

		self.instance.createDatabase(self.databaseId).then(function(results){
			const database = results[0];
			const operation = results[1];

			log.info('Waiting for operation on ' + self.databaseId + ' to complete.');
			operation.promise();
		}).then(function(){
			log.info('Created database ' + self.databaseId + 'on instance ' + self.instanceId + '.');
		}).catch(function(err){
			log.error('Could not create database ' + self.databaseId + ' on instance ' + self.instanceId + '.');
			throw error;
		});

/*
		log.info('[MySQL] Creating database....');

		self.connection.query('CREATE DATABASE IF NOT EXISTS ' + Config.mysqlDatabase, function(error, results, fields) {
			if (error)
				throw error;

			log.info('[MySQL] Successfully created database.');

			self.connection.query('USE ' + Config.mysqlDatabase, function(error, results, fields) {
				if (self.selectDatabase_callback)
					self.selectDatabase_callback();
			});
		});
*/
	},

	// TODO: This isn't used anywhere, remove/ignore?
	queryData: function(type, database, data) {
/*
		var self = this;

		self.connection.query(type + ' ' + database + ' SET ?', data, function(error) {
			if (error)
				throw error;

			log.info('Successfully updated ' + database);
		});
*/
	},

	alter: function(database, column, type) {
		var self = this;

		const query = {
			sql: 'ALTER TABLE ' + database + ' ADD ' + column + ' ' + type
		};

		self.database.run(query).then(function(results) {
			log.info('Database ' + database + ' has been successfully altered.');
		}).catch(function(err) {
			log.error('Malformation in the database type and/or type.');
		});
/*
		self.connection.query('ALTER TABLE ' + database + ' ADD ' + column + ' ' + type, function(error, results, fields) {
			if (error) {
				log.error('Malformation in the database type and/or type.');
				return;
			}

			log.info('Database ' + database + ' has been successfully altered.');
		});
*/
	},

	onSelected: function(callback) {
		this.selectDatabase_callback = callback;
	}

});