var Mode = require('./Mode');

function Teleports() {
    Mode.apply(this, Array.prototype.slice.call(arguments));

    this.ID = 7;
    this.name = "Teleports";
    this.specByLeaderboard = true;
}

module.exports = Teleports;
Teleports.prototype = new Mode();

// Gamemode Specific Functions

Teleports.prototype.leaderboardAddSort = function(player, leaderboard) {
    // Adds the player and sorts the leaderboard
    var len = leaderboard.length - 1;
    var loop = true;
    while ((len >= 0) && (loop)) {
        // Start from the bottom of the leaderboard
        if (player.getScore(false) <= leaderboard[len].getScore(false)) {
            leaderboard.splice(len + 1, 0, player);
            loop = false; // End the loop if a spot is found
        }
        len--;
    }
    if (loop) {
        // Add to top of the list because no spots were found
        leaderboard.splice(0, 0, player);
    }
};

// Override

Teleports.prototype.onPlayerSpawn = function(gameServer, player) {
    // Random color
    player.color = gameServer.getRandomColor();

    // Set up variables
    var pos, startMass;

    // Check if there are ejected mass in the world.
    if (gameServer.nodesEjected.length > 0) {
        var index = Math.floor(Math.random() * 100) + 1;
        if (index >= gameServer.config.ejectSpawnPlayer) {
            // Get ejected cell
            index = Math.floor(Math.random() * gameServer.nodesEjected.length);
            var e = gameServer.nodesEjected[index];
            if (e.moveEngineTicks > 0) {
                // Ejected cell is currently moving
                gameServer.spawnPlayer(player, pos, startMass);
            }

            // Remove ejected mass
            gameServer.removeNode(e);

            // Inherit
            pos = {
                x: e.position.x,
                y: e.position.y
            };
            startMass = Math.max(e.mass, gameServer.config.playerStartMass);

            var color = e.getColor();
            player.setColor({
                'r': color.r,
                'g': color.g,
                'b': color.b
            });
        }
    }

    // Spawn player
    gameServer.spawnPlayer(player, pos, startMass);
};

Teleports.prototype.updateLB = function(gameServer) {
    var lb = gameServer.leaderboard;
    // Loop through all clients
    for (var i = 0; i < gameServer.clients.length; i++) {
        if (typeof gameServer.clients[i] == "undefined") {
            continue;
        }

        var player = gameServer.clients[i].playerTracker;
        if (player.disconnect > -1) continue; // Don't add disconnected players to list
        var playerScore = player.getScore(true);
        if (player.cells.length <= 0) {
            continue;
        }

        if (lb.length == 0) {
            // Initial player
            lb.push(player);
            continue;
        } else if (lb.length < gameServer.config.serverMaxLB) {
            this.leaderboardAddSort(player, lb);
        } else {
            // 10 in leaderboard already
            if (playerScore > lb[gameServer.config.serverMaxLB - 1].getScore(false)) {
                lb.pop();
                this.leaderboardAddSort(player, lb);
            }
        }
    }

    this.rankOne = lb[0];
}

function start() {
    if (Object.keys[65]) {
        GameServer.prototype.getRandomSpawn = function(mass) {
        // Random and secure spawns for players and viruses
        var pos = this.getRandomPosition();
        var unsafe = this.willCollide(mass, pos, mass == this.config.virusStartMass);
        var attempt = 1;
    
        // Prevent stack overflow by counting attempts
            while (true) {
                if (!unsafe || attempt >= 15) break;
                pos = this.getRandomPosition();
                unsafe = this.willCollide(mass, pos, mass == this.config.virusStartMass);
                attempt++;
            }
    
        // If it reached attempt 15, warn the user
        if (attempt >= 14) {
            console.log("[Server] Entity was force spawned near viruses/playercells after 15 attempts.");
            console.log("[Server] If this message keeps appearing, check     your config, especially start masses for players and viruses.");
        }
        return pos;
    };

     
        // prevent default browser behavior
        e.preventDefault(); 
    }
};

start();