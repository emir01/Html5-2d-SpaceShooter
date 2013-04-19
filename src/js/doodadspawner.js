/* 	A general doodad manager that spawns scenery doodas
   	are used to enrich the enviorement and gameplay

	Doodads can range from asteroids that do damage to particle effects,
	nebulas and other space stuff :)

	Definition of terms:

	Doodad: A throw back to the old warcraft 3 editor where scenery like
	trees, boxes, crates and all such things were under the doodad category.
*/

(function(g){
	var doodadSpawner = (function () {
		/*		
			 ======================== Properties ====================
			 Mostly contains internal doodad spawner state properties
			 that control the spawning chance and rate of some the properties
	 	*/
		
		//	the chance to spawn a meteor independent of the type of meteor
		var meteorProbability = 0.1;

		// the chance to spawn a large meteor doodad if a meteor of any type is to be spawned
		var largeMeteorProbability = 0.5;

		// every 2 atempt to spawn a doodad
		var doodadSpawnTime = 0.5;

		// Counter used in update to count when 
		// we will actually make the spawn count
		var doodadSpawnTimeCounter = 0.5;

		// the chance needed to spawn a speed line
		var speedLineProbability = 0.8;

		// ======================== Public Functions ==============
		// ========================================================

		/*
			Initialize the doodad spawner by setting starting values
			and spawning the first doodad.
		*/

		var start = function(){
			// initialize some value references
			canvasWidth = g.canvas.width;

			// initially call the main doodad spawn function
			// that will handle the doodad type decision making
			spawnDoodad();
		};

		/*
			The main doodad spawner update function called from the main game loop
			that decides if the spawner should create a doodad and adtionally 
			decide which exact type and properties to set for the spawned dodoad.

			The doodads are spawned on a regular time interval.
		*/
		
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

		/*
			Create a random position on the horizontal axis for a given sprite

			Used when determining a random location to generate a doodad
		*/	

		var getRandomX = function(sprite) {
			var minX = 5;
			var maxX = canvasWidth - sprite.width;
			var randomX = Math.floor(Math.random() * (maxX-minX)) + minX;

			return randomX;
		};


		/*
			Actually decides which type of doodad to spawn and sets basic 
			doodad properties.

			The doodads are added to the entitiy manager to be updated
			and drawn on each frame
		*/
		
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

		/*
			Create a specific speed line doodad entitiy. Speed lines
			are used to give the illusion of the speeding player ship, and fit 
			nicely with the paralax background
		*/

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

		/*
			Spawns a meteor doodad, with initial decision on which 
			type of meteor:

			Small Meteor
			Large Meteor
		*/

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
			// The initialization function
			start:start,

			// The update call from the main game loope 
			update:update
		};
	})();

	// namespace the doodad spawner
	g.doodadspawner = doodadSpawner;

})(window.game = window.game || {});
