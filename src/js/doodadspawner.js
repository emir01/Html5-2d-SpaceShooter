// A general doodad manager that spawns scenery doodas
// that dont neceseraly do damage to the player.

// Doodads can range from asteroids that do damage to particle effects,
// nebulas and other space stuff :)
(function(g){
	var doodadSpawner = (function () {
		// ======================== Properties ====================
		// ========================================================

		//	the chance to spawn a meteor undependend of the type of meteor
		var meteorProbability = 0.1;

		// the chance to spawn a large meteor doodad if a meteor of any type is to be spawned
		var largeMeteorProbability = 0.5;

		// every 2 seconds spawn a doodad
		var doodadSpawnTime = 0.5;

		// Counter used in update to count when 
		// we will actually make the spawn count
		var doodadSpawnTimeCounter = 0.5;

		// the chance needed to spawn a speed line
		var speedLineProbability = 0.8;

		// ======================== Public Functions ==============
		// ========================================================

		// Start the timer that will spawn waves of enemies
		var start = function(){
			// initialize some value references
			canvasWidth = g.canvas.width;

			// initially call the main doodad spawn function
			// that will handle the doodad type decision making
			spawnDoodad();
		};

		// The main doodad spawner update function
		// Because doodads are manager
		var update = function() {
			// if the counter has ticked
			if(doodadSpawnTimeCounter <= 0){
				spawnDoodad();
				doodadSpawnTimeCounter = doodadSpawnTime;
			}
			else{
				// decrease the counter by dt
				// note that dt is given in ms
				doodadSpawnTimeCounter -= (g.dt / 1000);
			}
		};

		// ======================== Private Functions ==============
		// ========================================================

		// create a random x position to always fit the spawned doodads
		// on the x axis
		var getRandomX = function(sprite) {
			var minX = 5;
			var maxX = canvasWidth - sprite.width;
			var randomX = Math.floor(Math.random() * (maxX-minX)) + minX;

			return randomX;
		};

		// Spawns doodads after deciding the doodad type.
		// The doodads are added to the entitiy manager to be updated
		// and draw
		var spawnDoodad = function() {

			// Check if we will spawn a meteor doodad and then spawn it if true
			var spawnAnyMeteorChance = Math.random();
			if(spawnAnyMeteorChance <= meteorProbability){
				var meteorDoodad = createMeteorDoodad();
				g.emanager.addEntity(meteorDoodad, true);
			}
			
			// Check if we will spawn a speedline doodad and then spawn it if true
			var spanwSpeedLineChance  = Math.random();
			if(spanwSpeedLineChance <= speedLineProbability){
				var meteorLine = createSpeedLineDoodad();
				g.emanager.addEntity(meteorLine, true);
			}
		};

		var createSpeedLineDoodad = function(){
			// random meteor speed 
			var speedLineDoodad = new g.doodad(
					g.assets.speedLine, // the image for the dodoad
					getRandomX(g.assets.speedLine), // the x position
					-(g.assets.speedLine.height - 5), // the y position for the doodad
					1, // the base speed
					1,   // the base direction
					0,   // 
					false
				);

			return speedLineDoodad;
		};

		// Spawns a meteor doodad
		// Create indestructible meteor doodads
		var createMeteorDoodad = function(){
			// define some basic meteor props
			var meteorDoodad;
			var meteorTypeChance = Math.random();

			var direction = 1;

			// get a rotation that will be used to randomly rotate
			// the meteor sprite that will be drawn
			var meteorRotation = Math.floor(Math.random() * 180);

			// random meteor speed 
			var randomSpeed = ((Math.random() * 3) / 10) +0.2;

			// Decide if we want to spawn a large or small meteor

			// Drawing a small meteor
			if(largeMeteorProbability >= meteorTypeChance){
				meteorDoodad = new g.doodad(
					g.assets.meteorBig,
					getRandomX(g.assets.meteorBig),
					-(g.assets.meteorBig.height - 5),
					randomSpeed,
					direction,
					meteorRotation,
					false
				);
			}
			else {
				// create a large meteor enemy
				meteorDoodad = new g.doodad(
					g.assets.meteorSmall,
					getRandomX(g.assets.meteorSmall),
					-(g.assets.meteorSmall.height - 5),
					randomSpeed,
					direction,
					meteorRotation,
					false
				);
			}

			return meteorDoodad;
		};

		// ========================== RMP =========================
		// ========================================================

		return {
			start:start,
			update:update
		};
	})();

	// namespace the doodad spawner
	g.doodadspawner = doodadSpawner;

})(window.game = window.game || {});
