/* global log */

var cls = require('../lib/class');

module.exports = Creator = cls.Class.extend({

	init: function (Database)
	{
		var self = this;

		self.database = Database;
	},

	tableNotExists: function (tableName, ifNotExists)
	{
		var self = this,
			exists = 0;

		const query = {
			sql: 'SELECT count(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE (TABLE_NAME = \'' + tableName + '\')'
		};

		self.database.run(query).then(function (results)
		{
			// Results[0][0][0].value.value should be the number of rows
			exists = results[0][0][0].value.value;

			if (parseInt(exists) === 0)
			{
				ifNotExists();
			}

		}).catch(function (err)
		{
			log.error(err);
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

	createTables: function ()
	{
		var self = this;

		function handleError(tableName)
		{
			return function (error)
			{
				if (error)
				{
					log.error('[GoogleSpanner] Failed to created table ' + tableName + ' : ' + error);
					throw error;
				}
				else
				{
					log.info('[GoogleSpanner] Created table ' + tableName);
				}
			};
		}

		self.tableNotExists('player_data', function ()
		{
			const schema =
				'CREATE TABLE player_data (' +
				'username STRING(1024),' +
				'email STRING(1024),' +
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
				'mute STRING(1024),' +
				'membership STRING(1024),' +
				'lastLogin STRING(1024),' +
				'guild STRING(1024),' +
				'lastWarp STRING(1024)' +
				') PRIMARY KEY(username)';

			self.database.createTable(schema, function (err, table, operation, apiResponse)
			{
				if (err)
				{
					handleError('player_data');
				}

				operation.promise();

				operation
					.on('error', function (err)
					{
						handleError('player_data');
					})
					.on('complete', function ()
					{
						log.info('[GoogleSpanner] player_data table created.');
					});
			});
		});

		self.tableNotExists('player_equipment', function ()
		{
			const schema =
				'CREATE TABLE player_equipment (' +
				'username STRING(1024),' +
				'armour STRING(1024),' +
				'weapon STRING(1024),' +
				'pendant STRING(1024),' +
				'ring STRING(1024),' +
				'boots STRING(1024)' +
				') PRIMARY KEY(username)';

			self.database.createTable(schema, function (err, table, operation, apiResponse)
			{
				if (err)
				{
					handleError('player_equipment');
				}

				operation.promise();

				operation
					.on('error', function (err)
					{
						handleError('player_equipment');
					})
					.on('complete', function ()
					{
						log.info('[GoogleSpanner] player_equipment table created.');
					});
			});
		});

		self.tableNotExists('player_quests', function ()
		{
			const schema =
				'CREATE TABLE player_quests (' +
				'username STRING(1024),' +
				'ids STRING(1024) NOT NULL,' +
				'stages STRING(1024) NOT NULL' +
				') PRIMARY KEY(username)';

			self.database.createTable(schema, function (err, table, operation, apiResponse)
			{
				if (err)
				{
					handleError('player_quests');
				}

				operation.promise();

				operation
					.on('error', function (err)
					{
						handleError('player_quests');
					})
					.on('complete', function ()
					{
						log.info('[GoogleSpanner] player_quests table created.');
					});
			});
		});

		self.tableNotExists('player_achievements', function ()
		{
			const schema =
				'CREATE TABLE player_achievements (' +
				'username STRING(1024),' +
				'ids STRING(1024) NOT NULL,' +
				'progress STRING(1024) NOT NULL' +
				') PRIMARY KEY(username)';

			self.database.createTable(schema, function (err, table, operation, apiResponse)
			{
				if (err)
				{
					handleError('player_achievements');
				}

				operation.promise();

				operation
					.on('error', function (err)
					{
						handleError('player_achievements');
					})
					.on('complete', function ()
					{
						log.info('[GoogleSpanner] player_achievements table created.');
					});
			});
		});

		self.tableNotExists('player_bank', function ()
		{
			const schema =
				'CREATE TABLE player_bank (' +
				'username STRING(1024),' +
				'ids STRING(1024) NOT NULL,' +
				'counts STRING(1024) NOT NULL,' +
				'abilities STRING(1024) NOT NULL,' +
				'abilityLevels STRING(1024) NOT NULL' +
				') PRIMARY KEY(username)';

			self.database.createTable(schema, function (err, table, operation, apiResponse)
			{
				if (err)
				{
					handleError('player_bank');
				}

				operation.promise();

				operation
					.on('error', function (err)
					{
						handleError('player_bank');
					})
					.on('complete', function ()
					{
						log.info('[GoogleSpanner] player_bank table created.');
					});
			});
		});

		self.tableNotExists('player_abilities', function ()
		{
			const schema =
				'CREATE TABLE player_abilities (' +
				'username STRING(1024),' +
				'abilities STRING(1024) NOT NULL,' +
				'abilityLevels STRING(1024) NOT NULL,' +
				'shortcuts STRING(1024) NOT NULL' +
				') PRIMARY KEY (username)';

			self.database.createTable(schema, function (err, table, operation, apiResponse)
			{
				if (err)
				{
					handleError('player_abilities');
				}

				operation.promise();

				operation
					.on('error', function (err)
					{
						handleError('player_abilities');
					})
					.on('complete', function ()
					{
						log.info('[GoogleSpanner] player_abilities table created.');
					});
			});
		});

		self.tableNotExists('player_inventory', function ()
		{
			const schema =
				'CREATE TABLE player_inventory (' +
				'username STRING(1024),' +
				'ids STRING(1024) NOT NULL,' +
				'counts STRING(1024) NOT NULL,' +
				'abilities STRING(1024) NOT NULL,' +
				'abilityLevels STRING(1024) NOT NULL' +
				') PRIMARY KEY(username)';

			self.database.createTable(schema, function (err, table, operation, apiResponse)
			{
				if (err)
				{
					handleError('player_inventory');
				}

				operation.promise();

				operation
					.on('error', function (err)
					{
						handleError('player_inventory');
					})
					.on('complete', function ()
					{
						log.info('[GoogleSpanner] player_inventory table created.');
					});
			});
		});

		self.tableNotExists('ipbans', function ()
		{
			const schema =
				'CREATE TABLE ipbans (' +
				'ip STRING(1024),' +
				'ipban INT64' +
				') PRIMARY KEY(ip)';

			self.database.createTable(schema, function (err, table, operation, apiResponse)
			{
				if (err)
				{
					handleError('ipbans');
				}

				operation.promise();

				operation
					.on('error', function (err)
					{
						handleError('ipbans');
					})
					.on('complete', function ()
					{
						log.info('[GoogleSpanner] ipbans table created.');
					});
			});
		});
	},

	save: function (player)
	{
		var self = this,
			playerData = self.formatData(self.getPlayerData(player), 'data'),
			equipmentData = self.formatData(self.getPlayerData(player), 'equipment');

		var handleError = function (error)
		{
			if (error)
			{
				log.error(error);
			}
		};

		const playerDataTable = self.database.table('player_data');
		const playerEquipmentTable = self.database.table('player_equipment');
		const playerInventoryTable = self.database.table('player_inventory');
		const playerAbilitiesTable = self.database.table('player_abilities');
		const playerBankTable = self.database.table('player_bank');
		const playerQuestsTable = self.database.table('player_quests');
		const playerAchievementsTable = self.database.table('player_achievements');

		// TODO: This is malformed, will need to fix. Needs to be JSON, not a string
		const playerDataQuery = [playerData];
		const equipmentDataQuery = [equipmentData];
		const playerInventoryQuery = {sql: '`player_inventory` SET ' + player.inventory.getArray()};
		const playerAbilitiesQuery = {sql: '`player_abilities` SET ' + player.abilities.getArray()};
		const playerBankQuery = {sql: '`player_bank` SET ' + player.bank.getArray()};
		const playerQuestsQuery = {sql: '`player_quests` SET ' + player.quests.getQuests()};
		const playerAchievementsQuery = {sql: '`player_achievements` SET ' + player.quests.getAchievements()};

		if (player.isNew)
		{
			playerDataTable.insert(playerDataQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerEquipmentTable.insert(equipmentDataQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerInventoryTable.insert(playerInventoryQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerAbilitiesTable.insert(playerAbilitiesQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerBankTable.insert(playerBankQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerQuestsTable.insert(playerQuestsQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerAchievementsTable.insert(playerAchievementsQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});
		}
		else
		{
			playerDataTable.update(playerDataQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerEquipmentTable.update(equipmentDataQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerInventoryTable.update(playerInventoryQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerAbilitiesTable.update(playerAbilitiesQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerBankTable.update(playerBankQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerQuestsTable.update(playerQuestsQuery).then(function (results)
			{
			}).catch(function (err)
			{
				handleError(err);
			});

			playerAchievementsTable.update(playerAchievementsQuery).then(function (results)
			{
			}).catch(function (err)
			{
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

	formatData: function (data, type)
	{
		var formattedData;

		switch (type)
		{
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

	getPlayerData: function (player)
	{
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
		};
	}

});