const SPAWN = "Spawn1";
const MAX_CREEPS = 8;
let PREV_CREEP = 0;

module.exports.loop = function() {
    doSpawnEvents();
    for (let creep in Game.creeps) {
        let creepObj = Game.creeps[creep];
        doCreepEvents(creepObj);
    }
    deleteOldCreeps();
}

/* Polls */
function doSpawnEvents() {
    let spawn = Game.spawns[SPAWN];

    if (spawn.energy >= 200 && getCreepAmount() < MAX_CREEPS) {
        spawn.spawnCreep([WORK, CARRY, MOVE], `Harvester-${PREV_CREEP}`);
        PREV_CREEP += 1;
    }
}

function doCreepEvents(creep) {
    if (creep.store.getUsedCapacity() == 0 || creep.memory.isMining) {
        if (!creep.memory.isMining) {
            creep.memory.isMining = true;
        }
        _doCreepMining(creep);
    }
    else {
        if (getCreepAmount() < MAX_CREEPS) {
            _fillSpawner(creep);
        }
        else {
            _upgradeController(creep);
        }
    }
}
function _doCreepMining(creep) {
    let sources = creep.room.find(FIND_SOURCES);
    let response = creep.harvest(sources[0]);
    if (response == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
    }
    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.isMining = false;
    }
}
function _fillSpawner(creep) {
    let response = creep.transfer(Game.spawns[SPAWN], RESOURCE_ENERGY);
    if (response == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns[SPAWN]);
    }
}
function _upgradeController(creep) {
    let response = creep.upgradeController(creep.room.controller);
    if (response == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
    }
}


/* Utility functions */
function getCreepAmount() {
    let amount = 0;
    for (let _ in Game.creeps) {
        amount += 1;
    }
    return amount;
}

function deleteOldCreeps() {
    for (let creep in Memory.creeps) {
        if (!(creep in Game.creeps)) {
            delete Memory.creeps[creep];
        }
    }
}