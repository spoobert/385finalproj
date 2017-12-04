/* global log */

var cls = require('../lib/class');

module.exports = Creator = cls.Class.extend({

	init: function(Database) {
		var self = this;

		self.projectId = projectId;

		self.database = Database;
	},

	tableNotExists: function(tableName, ifNotExists) {
		var self = this,
			exists = 0;

		const query = {
			sql: 'SELECT count(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE (TABLE_SCHEMA = ' +self.database + ') AND (TABLE_NAME = ' + tableName + ')'
		};

		self.database.run(query).then(function(results) {
			// Results[0] should be the number of rows?
			exists = results[0];

			if(exists === 0)
				ifNotExists();

		});
/*
		self.mysql.connection.query('SELECT count(*) as count FROM information_schema.TABLES WHERE (TABLE_SCHEMA = ?) AND (TABLE_NAME = ?)', [self.mysql.database, tableName], function (err, rows) {
			if (err) {
				log.error(err);
				throw err;
			}

			exists = rows[0].count;

			if (exists === 0)
				ifNotExists();

		});
*/
	},

	createTables: function() {
		var self = this;

		function handleError(tableName) {
			return function(error) {
				if (error) {
					log.error('[GoogleSpanner] Failed to created table ' + tableName + ' : ' + error);
					throw error;
				} else
					log.info('[GoogleSpanner] Created table ' + tableName);
			}
		}

		self.tableNotExists('player_data', function() {
			const query = {
				sql: 'CREATE TABLE player_data (' +
				'username STRING,' +
				'email STRING,' +
				'x INT64,' +
				'y INT64,' +
				'experience INT64,' +
				'kind INT64,' +
				'rights INT64,' +
				'poisoned BOOL,' +
				'hitPoints INT64,' +
				'mana INT64,' +
				'pvpKills INT64,' +
				'pvpDeaths INT64,' +
				'rank INT64,' +
				'ban INT64,' +
				'mute STRING,' +
				'membership STRING,' +
				'lastLogin STRING,' +
				'guild STRING,' +
				'lastWarp STRING,' +
				'PRIMARY KEY(username))'
			};

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
					handleError('player_data');
				});

/*
			self.mysql.connection.query('CREATE TABLE player_data (' +
				'username varchar(64),' +
				'email varchar(64),' +
				'x int,' +
				'y int,' +
				'experience int,' +
				'kind int,' +
				'rights int,' +
				'poisoned tinyint,' +
				'hitPoints int,' +
				'mana int,' +
				'pvpKills int,' +
				'pvpDeaths int,' +
				'rank int,' +
				'ban int(64),' +
				'mute varchar(64),' +
				'membership varchar(64),' +
				'lastLogin varchar(64),' +
				'guild varchar(64),' +
				'lastWarp varchar(64),' +
				'PRIMARY KEY(username))', handleError('player_data'));
*/
		});

		self.tableNotExists('player_equipment', function() {
			const query = {
				sql: 'CREATE TABLE player_equipment (' +
				'username STRING,' +
				'armour STRING,' +
				'weapon STRING,' +
				'pendant STRING,' +
				'ring STRING,' +
				'boots STRING,' +
				'PRIMARY KEY(username))'
			};

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
				handleError('player_equipment');
			});
/*
			self.mysql.connection.query('CREATE TABLE player_equipment (' +
				'username varchar(64),' +
				'armour varchar(64),' +
				'weapon varchar(64),' +
				'pendant varchar(64),' +
				'ring varchar(64),' +
				'boots varchar(64),' +
				'PRIMARY KEY(username))',  handleError('player_equipment'))
*/
		});

		self.tableNotExists('player_quests', function() {
			const query = {
				sql: 'CREATE TABLE player_quests (' +
				'username STRING,' +
				'ids text COLLATE utf8_unicode_ci NOT NULL,' +
				'stages text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY(username))'
			};

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
				handleError('player_quests');
			});
/*
			self.mysql.connection.query('CREATE TABLE player_quests (' +
				'username varchar(64),' +
				'ids text COLLATE utf8_unicode_ci NOT NULL,' +
				'stages text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY(username))',  handleError('player_quests'))
*/
		});

		self.tableNotExists('player_achievements', function() {
			const query = {
				sql: 'CREATE TABLE player_achievements (' +
				'username STRING,' +
				'ids text COLLATE utf8_unicode_ci NOT NULL,' +
				'progress text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY(username))'
			};

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
				handleError('player_achievements');
			});
/*
			self.mysql.connection.query('CREATE TABLE player_achievements (' +
				'username varchar(64),' +
				'ids text COLLATE utf8_unicode_ci NOT NULL,' +
				'progress text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY(username))',  handleError('player_achievements'))
*/
		});

		self.tableNotExists('player_bank', function() {
			const query = {
				sql: 'CREATE TABLE player_bank (' +
				'username STRING,' +
				'ids text COLLATE utf8_unicode_ci NOT NULL,' +
				'counts text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY(username))'
			};

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
				handleError('player_bank');
			});
/*
			self.mysql.connection.query('CREATE TABLE player_bank (' +
				'username varchar(64),' +
				'ids text COLLATE utf8_unicode_ci NOT NULL,' +
				'counts text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY(username))', handleError('player_bank'))
*/
		});

		self.tableNotExists('player_abilities', function() {
			const query = {
				sql: 'CREATE TABLE player_abilities (' +
				'username STRING,' +
				'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
				'shortcuts text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY (username))'
			};

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
				handleError('player_abilities');
			});
/*
			self.mysql.connection.query('CREATE TABLE player_abilities (' +
				'username varchar(64),' +
				'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
				'shortcuts text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY (username))', handleError('player_abilities'))
*/
		});

		self.tableNotExists('player_inventory', function() {
			const query = {
				sql: 'CREATE TABLE player_inventory (' +
				'username STRING,' +
				'ids text COLLATE utf8_unicode_ci NOT NULL,' +
				'counts text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY(username))'
			};

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
				handleError('player_inventory');
			});
/*
			self.mysql.connection.query('CREATE TABLE player_inventory (' +
				'username varchar(64),' +
				'ids text COLLATE utf8_unicode_ci NOT NULL,' +
				'counts text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
				'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
				'PRIMARY KEY(username))', handleError("player_inventory"))
*/
		});

		self.tableNotExists('ipbans', function () {
			const query = {
				sql: 'CREATE TABLE IF NOT EXISTS ipbans (' +
				'ip STRING,' +
				'ipban INT64,' +
				'PRIMARY KEY(ip))'
			};

			self.database.run(query).then(function(results) {
			}).catch(function(err) {
				handleError('ipbans');
			});
/*
			self.mysql.connection.query('CREATE TABLE IF NOT EXISTS ipbans (' +
				'ip varchar(64),' +
				'ipban int(64),' +
				'PRIMARY KEY(ip))', handleError('ipbans'))
*/
		});
	},

	save: function(player) {
		var self = this,
			playerData = self.formatData(self.getPlayerData(player), 'data'),
			equipmentData = self.formatData(self.getPlayerData(player), 'equipment');

		var handleError = function (error) {
			if (error)
				log.error(error);
		};

		const playerDataTable = self.database.table('player_data');
		const playerEquipmentTable = self.database.table('player_equipment');
		const playerInventoryTable = self.database.table('player_inventory');
		const playerAbilitiesTable = self.database.table('player_abilities');
		const playerBankTable = self.database.table('player_bank');
		const playerQuestsTable = self.database.table('player_quests');
		const playerAchievementsTable = self.database.table('player_achievements');

		// TODO: This is malformed, will need to fix. Needs to be JSON, not a string
		const playerDataQuery = [ playerData ];
		const equipmentDataQuery = [ equipmentData ];
		const playerInventoryQuery = { sql: '`player_inventory` SET ' + player.inventory.getArray() };
		const playerAbilitiesQuery = { sql: '`player_abilities` SET ' + player.abilities.getArray() };
		const playerBankQuery = { sql: '`player_bank` SET ' + player.bank.getArray() };
		const playerQuestsQuery = { sql: '`player_quests` SET ' + player.quests.getQuests() };
		const playerAchievementsQuery = { sql: '`player_achievements` SET ' + player.quests.getAchievements() };

		if(player.isNew)
		{
			playerDataTable.insert(playerDataQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerEquipmentTable.insert(equipmentDataQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerInventoryTable.insert(playerInventoryQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerAbilitiesTable.insert(playerAbilitiesQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerBankTable.insert(playerBankQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerQuestsTable.insert(playerQuestsQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerAchievementsTable.insert(playerAchievementsQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});
		}
		else
		{
			playerDataTable.update(playerDataQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerEquipmentTable.update(equipmentDataQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerInventoryTable.update(playerInventoryQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerAbilitiesTable.update(playerAbilitiesQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerBankTable.update(playerBankQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerQuestsTable.update(playerQuestsQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});

			playerAchievementsTable.update(playerAchievementsQuery).then(function(results) {
			}).catch(function(err) {
				handleError(err);
			});
		}
/*
		self.mysql.connection.query(queryKey + ' `player_data` SET ?', playerData, handleError);
		self.mysql.connection.query(queryKey + ' `player_equipment` SET ?', equipmentData, handleError);
		self.mysql.connection.query(queryKey + ' `player_inventory` SET ?', player.inventory.getArray(), handleError);
		self.mysql.connection.query(queryKey + ' `player_abilities` SET ?', player.abilities.getArray(), handleError);
		self.mysql.connection.query(queryKey + ' `player_bank` SET ?', player.bank.getArray(), handleError);
		self.mysql.connection.query(queryKey + ' `player_quests` SET ?', player.quests.getQuests(), handleError);
		self.mysql.connection.query(queryKey + ' `player_achievements` SET ?', player.quests.getAchievements(), handleError);
*/
	},

	formatData: function(data, type) {
		var formattedData;

		switch(type) {
			case 'data':
				formattedData = {
					username: data.username,
					email: data.email,
					x: data.x,
					y: data.y,
					experience: data.experience,
					kind: data.kind,
					rights: data.rights,
					poisoned: data.poisoned,
					hitPoints: data.hitPoints.getHitPoints(),
					mana: data.mana.getMana(),
					pvpKills: data.pvpKills,
					pvpDeaths: data.pvpDeaths,
					rank: data.rank,
					ban: data.ban,
					mute: data.mute,
					membership: data.membership,
					lastLogin: data.lastLogin,
					guild: data.guild,
					lastWarp: data.lastWarp
				};
				break;

			case 'equipment':

				formattedData = {
					username: data.username,
					armour: data.armour.toString(),
					weapon: data.weapon.toString(),
					pendant: data.pendant.toString(),
					ring: data.ring.toString(),
					boots: data.boots.toString()
				};

				break;
		}

		return formattedData;
	},

	getPlayerData: function(player) {
		return {
			username: player.username,
			email: player.email ? player.email : 'null',
			x: player.x ? player.x : -1,
			y: player.y ? player.y : -1,
			kind: player.kind ? player.kind : 0,
			rights: player.rights ? player.rights : 0,
			hitPoints: player.hitPoints ? player.hitPoints : 100,
			mana: player.mana ? player.mana : 20,
			poisoned: player.poisoned ? player.poisoned : 0,
			experience: player.experience ? player.experience : 0,
			ban: player.ban ? player.ban : 0,
			mute: player.mute ? player.mute : 0,
			rank: player.rank ? player.rank : 0,
			membership: player.membership ? player.membership : 0,
			lastLogin: player.lastLogin ? player.lastLogin : 0,
			guild: player.guild ? player.guild : '',
			pvpKills: player.pvpKills ? player.pvpKills : 0,
			pvpDeaths: player.pvpDeaths ? player.pvpDeaths : 0,
			lastWarp: player.warp.lastWarp ? player.warp.lastWarp : 0,
			armour: [player.armour ? player.armour.getId() : 114, player.armour ? player.armour.getCount() : 0, player.armour ? player.armour.getAbility() : 0, player.armour ? player.armour.getAbilityLevel() : 0],
			weapon: [player.weapon ? player.weapon.getId() : -1, player.weapon ? player.weapon.getCount() : 0, player.weapon ? player.weapon.getAbility() : 0, player.weapon ? player.weapon.getAbilityLevel() : 0],
			pendant: [player.pendant ? player.pendant.getId() : -1, player.pendant ? player.pendant.getCount() : 0, player.pendant ? player.pendant.getAbility() : 0, player.pendant ? player.pendant.getAbilityLevel() : 0],
			ring: [player.ring ? player.ring.getId() : -1, player.ring ? player.ring.getCount() : 0, player.ring ? player.ring.getAbility() : 0, player.ring ? player.ring.getAbilityLevel() : 0],
			boots: [player.boots ? player.boots.getId() : -1, player.boots ? player.boots.getCount() : 0, player.boots ? player.boots.getAbility() : 0, player.boots ? player.boots.getAbilityLevel() : 0]
		}
	}

});