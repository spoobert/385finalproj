/* global log, _, Modules, Packets */

define(['../renderer/grids', '../entity/objects/chest',
        '../entity/character/character', '../entity/character/player/player',
        '../entity/objects/item', './sprites', '../entity/character/mob/mob',
        '../entity/character/npc/npc', '../entity/objects/projectile'],
    function(Grids, Chest, Character, Player, Item, Sprites, Mob, NPC, Projectile) {

        return Class.extend({

            init: function(game) {
                var self = this;

                self.game = game;
                self.renderer = game.renderer;

                self.grids = null;
                self.sprites = null;

                self.entities = {};
                self.decrepit = {};
            },

            load: function() {
                var self = this;

                self.game.app.sendStatus('Loading sprites');

                if (!self.sprites) {
                    self.sprites = new Sprites(self.game.renderer);

                    self.sprites.onLoadedSprites(function() {
                        self.game.input.loadCursors();
                    });
                }

                self.game.app.sendStatus('Loading grids');

                if (!self.grids)
                    self.grids = new Grids(self.game.map);
            },

            update: function() {
                var self = this;

                if (self.sprites)
                    self.sprites.updateSprites();
            },

            create: function(info) {
                var self = this,
                    entity;

                if (self.isPlayer(info.id))
                    return;

                switch (info.type) {

                    case 'chest':

                        /**
                         * Here we will parse the different types of chests..
                         * We can go Dark Souls style and implement mimics
                         * the proper way -ahem- TTA V1.0
                         */

                        var chest = new Chest(info.id, info.string);

                        entity = chest;

                        break;

                    case 'npc':

                        var npc = new NPC(info.id, info.string);

                        entity = npc;

                        break;

                    case 'item':

                        var item = new Item(info.id, info.string, info.count, info.ability, info.abilityLevel);

                        entity = item;

                        break;

                    case 'mob':

                        var mob = new Mob(info.id, info.string);

                        mob.setHitPoints(info.hitPoints);
                        mob.setMaxHitPoints(info.maxHitPoints);

                        mob.attackRange = info.attackRange;
                        mob.level = info.level;

                        entity = mob;

                        break;

                    case 'projectile':
                        var attacker = self.get(info.characterId),
                            target = self.get(info.targetId);

                        if (!attacker || !target)
                            return;

                        attacker.lookAt(target);

                        var projectile = new Projectile(info.id, info.projectileType, attacker);

                        projectile.name = info.name;

                        projectile.setStart(attacker.x, attacker.y);
                        projectile.setTarget(target);

                        projectile.setSprite(self.getSprite(projectile.name));
                        projectile.setAnimation('travel', projectile.getSpeed());

                        projectile.angled = true;
                        projectile.type = info.type;
                        projectile.special = info.special;

                        /**
                         * Move this into the external overall function
                         */

                        projectile.onImpact(function() {
                            /**
                             * The data in the projectile is only for rendering purposes
                             * there is nothing you can change for the actual damage output here.
                             */

                            if (self.isPlayer(projectile.owner.id) || self.isPlayer(target.id))
                                self.game.socket.send(Packets.Projectile, [Packets.ProjectileOpcode.Impact, info.id, target.id]);

                            self.game.info.create(Modules.Hits.Damage, [info.damage, self.isPlayer(target.id)], target.x, target.y);

                            target.triggerHealthBar();

                            self.unregisterPosition(projectile);
                            delete self.entities[projectile.getId()];

                        });

                        self.addEntity(projectile);

                        attacker.performAction(attacker.orientation, Modules.Actions.Attack);
                        attacker.triggerHealthBar();

                        return;

                    case 'player':

                        var player = new Player();

                        player.setId(info.id);
                        player.setName(info.name);
                        player.setGridPosition(info.x, info.y);

                        player.rights = info.rights;
                        player.level = info.level;
                        player.pvp = info.pvp;
                        player.pvpKills = info.pvpKills;
                        player.pvpDeaths = info.pvpDeaths;
                        player.type = info.type;

                        var hitPointsData = info.hitPoints,
                            manaData = info.mana;

                        player.setHitPoints(hitPointsData[0]);
                        player.setMaxHitPoints(hitPointsData[1]);

                        player.setMana(manaData[0]);
                        player.setMaxMana(manaData[1]);

                        player.setSprite(self.getSprite(info.armour[1]));
                        player.idle();

                        player.setEquipment(Modules.Equipment.Armour, info.armour);
                        player.setEquipment(Modules.Equipment.Weapon, info.weapon);
                        player.setEquipment(Modules.Equipment.Pendant, info.pendant);
                        player.setEquipment(Modules.Equipment.Ring, info.ring);
                        player.setEquipment(Modules.Equipment.Boots, info.boots);

                        player.loadHandler(self.game);

                        self.addEntity(player);


                        return;
                }

                if (!entity)
                    return;

                entity.setGridPosition(info.x, info.y);
                entity.setName(info.name);

                entity.setSprite(self.getSprite(info.type === 'item' ? 'item-' + info.string : info.string));

                entity.idle();
                entity.type = info.type;

                self.addEntity(entity);

                if (info.type !== 'item' && entity.handler) {
                    entity.handler.setGame(self.game);
                    entity.handler.load();
                }

                /**
                 * Get ready for errors!
                 */

            },

            isPlayer: function(id) {
                return this.game.player.id === id;
            },

            get: function(id) {
                var self = this;

                if (id in self.entities)
                    return self.entities[id];

                return null;
            },

            exists: function(id) {
                return id in this.entities;
            },

            clearPlayers: function(exception) {
                var self = this;

                _.each(self.entities, function(entity) {
                    if (entity.id !== exception.id && entity.type === 'player') {
                        self.grids.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
                        self.grids.removeFromPathingGrid(entity.gridX, entity.gridY);

                        delete self.entities[entity.id];
                    }
                });

                self.grids.resetPathingGrid();
            },

            addEntity: function(entity) {
                var self = this;

                if (self.entities[entity.id])
                    return;

                self.entities[entity.id] = entity;
                self.registerPosition(entity);

                if (!(entity instanceof Item && entity.dropped) && !self.renderer.isPortableDevice())
                    entity.fadeIn(self.game.time);

            },

            removeItem: function(item) {
                var self = this;

                if (!item)
                    return;

                self.grids.removeFromItemGrid(item, item.gridX, item.gridY);
                self.grids.removeFromRenderingGrid(item, item.gridX, item.gridY);

                delete self.entities[item.id];
            },

            registerPosition: function(entity) {
                var self = this;

                if (!entity)
                    return;

                if (entity.type === 'player' || entity.type === 'mob' || entity.type === 'npc' || entity.type === 'chest') {

                    self.grids.addToEntityGrid(entity, entity.gridX, entity.gridY);

                    if (entity.type !== 'player' || entity.nonPathable)
                        self.grids.addToPathingGrid(entity.gridX, entity.gridY);
                }

                if (entity.type === 'item')
                    self.grids.addToItemGrid(entity, entity.gridX, entity.gridY);

                self.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);
            },

            registerDuality: function(entity) {
                var self = this;

                if (!entity)
                    return;

                self.grids.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

                self.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);

                if (entity.nextGridX > -1 && entity.nextGridY > -1) {
                    self.grids.entityGrid[entity.nextGridY][entity.nextGridX][entity.id] = entity;

                    if (!(entity instanceof Player))
                        self.grids.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
                }
            },

            unregisterPosition: function(entity) {
                var self = this;

                if (!entity)
                    return;

                self.grids.removeEntity(entity);
            },

            getSprite: function(name) {
                return this.sprites.sprites[name];
            },

            getAll: function() {
                return this.entities;
            },

            forEachEntity: function(callback) {
                _.each(this.entities, function(entity) { callback(entity) }) ;
            },

            forEachEntityAround: function(x, y, radius, callback) {
                var self = this;

                for (var i = x - radius, max_i = x + radius; i <= max_i; i++) {
                    for (var j = y - radius, max_j = y + radius; j <= max_j; j++) {
                        if (self.map.isOutOfBounds(i, j))
                            continue;

                        _.each(self.grids.renderingGrid[j][i], function(entity) {
                            callback(entity);
                        })
                    }
                }
            }

        });

    });