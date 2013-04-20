/*
	Spawn and manage enemy waves. The spawner is responsible for randomly spawning only enemy entities.

	The spawner functionality is also the main difficulty increasing entitiy as it is dependent on State
	and the wave counter to icnrease the enemy spawn rate.

	The spawner is an entitiy object that also gets called upon from the main game loop as it needs
	to check elapsed time from last enemy spawn.
*/	

(function(g){
	g.spawner = (function(){
		// ======================== Properties ====================
		//=========================================================

		// Keeps local spawn time counter, which is updated and reduced on each update call.
		var spawnTimeCounter;

		// Utility canvas width property used in random enemy spawn calculation for the horizontal position
		var canvasWidth;

		// ================== Public Functions ====================
		// =========================================================

		/*
			Initialization function that initializes the spawner
			by setting the canvas width utility property and the initial 
		*/

		var start = function(){
			// initialize some value references
			canvasWidth = g.canvas.width;

			// set  internaly spawn time counter to ther State spawn time.
			// State spawn time will be reduced with each wave so we must keep local reference that will 
			// be used for spawner counting
			spawnTimeCounter = g.state.getSpawnTime();
		};

		/*
			The Spawner entitiy update function that is called from the main game loop. The spawn update 
			will reduce the spawn time counter for the time elapsed from the last game loop call, which is presented
			by the g.dt (delta time) variable
		*/

		var update = function(){
			
			// if the spawn time counter is 0 or below we will spawn an enemy and reset
			// the counter as stored by State
			if(spawnTimeCounter <= 0){
				spawnEnemy()
				spawnTimeCounter = g.state.getSpawnTime();
			}
			else{
				// with each update we are reducing it until we reach zero, meaning spawn
				spawnTimeCounter-= (g.dt / 1000);
			}
		};

		// ================== Private Functions ====================
		// =========================================================
		
		/*
			Utility function that returns a random x location based on the canvas width and the sprites width
			taking into consideration to always spawn entities/enemies that are fully visible.

			Sprite/Enemy width is used as js coord system is upper-left based
		*/

		var getRandomX = function(sprite){
			var minX = 5;
			var maxX = canvasWidth - sprite.width;
			var randomX = Math.floor(Math.random() * (maxX-minX)) + minX;

			return randomX;
		};

		/*
			Creates an enemy ship entitiy and adds it to the entity manager.
		*/

		var spawnEnemy = function(){
			// declare the entitiy that will get spawned
			// and determine the type of spawn
			var spawnedEntitiy;
			
			// Create a regular enemy for now
			spawnedEntitiy = createShipEnemy();
			
			// add the spawned enemy to the entitiy manager 
			// set the entitiy to be removed if it goes off bounds
			g.emanager.addEntity(spawnedEntitiy, true);
		};

		/*
			Create a bsic ship enemy to be spawned by the main spawnEnemy method
		*/

		var createShipEnemy = function(){

			// Determine random spawn properties
			var randomX = getRandomX(g.assets.enemy);
			var randomSpeed = (((Math.random() * 3)) / 10) + 0.2;
			
			// Create and return the enemy entitiy
			var shipEnemy = new g.enemy(
				g.assets.enemy,
				randomX,
				-(g.assets.enemy.height-5),
				randomSpeed,
				0, // zero rotation
				true // does it fire	
			);
			
			return shipEnemy;
		}

		// ========================== RMP =========================
		//=========================================================

		return{
			// Initialization
			start:start,

			// The update method called from the main loop
			update:update
		};
	})();
})(window.game = window.game || {});
