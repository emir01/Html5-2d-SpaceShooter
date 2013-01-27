// Spawn and manage enemy waves. The wave count increments periodically 
// making the enemies faster and more frequent
(function(g){
	g.spawner = (function(){
		// ======================== Properties ====================
		//=========================================================

		// we are using a counter and dt so we dont
		// have the render all bug when losing focus
		var spawnTimeCounter;

		// utility properties
		var canvasWidth;

		// ================== Public Functions ====================
		// =========================================================

		// Start the timer that will spawn waves of enemies
		var start = function(){
			// initialize some value references
			canvasWidth = g.canvas.width;

			spawnTimeCounter = g.state.getSpawnTime();

			// spawn an enemy at the begining
			spawnEnemy();
		};

		// the spawner update function that is only used to 
		// check spawn timers.
		var update = function(){
			// if the counter has ticked
			if(spawnTimeCounter <= 0){
				spawnEnemy()
				spawnTimeCounter = g.state.getSpawnTime();
			}
			else{
				// decrease the counter by dt
				// note that dt is given in ms
				spawnTimeCounter-= (g.dt / 1000);
			}
		};

		// Start a new enemy wave
		var startNextWave = function(){

		};

		// ================== Private Functions ====================
		// =========================================================
		
		// create a random x position to always fit the spawned sprites
		// on the x axis
		var getRandomX = function(sprite){
			var minX = 5;
			var maxX = canvasWidth - sprite.width;
			var randomX = Math.floor(Math.random() * (maxX-minX)) + minX;

			return randomX;
		};

		// The main spawner function that actually spawns enemies
		var spawnEnemy = function(){
			// declare the entitiy that will get spawned
			// and determine the type of spawn
			var spawnedEntitiy;
			
			// Create a regular enemy
			spawnedEntitiy = createShipEnemy();
			
			// add the spawned enemy to the entitiy manager 
			// set the entitiy to be removed if it goes off bounds
			g.emanager.addEntity(spawnedEntitiy, true);
		};

		// Create a destroyable basic ship enemy.
		var createShipEnemy = function(){
			var randomX = getRandomX(g.assets.enemy);
			var randomSpeed = (((Math.random() * 3)) / 10) + 0.2;

			var shipEnemy = new g.enemy(
				g.assets.enemy,
				randomX,
				-(g.assets.enemy.height-5),
				randomSpeed
			);
			
			return shipEnemy;
		}

		// ========================== RMP =========================
		//=========================================================

		return{
			start:start,
			startNextWave: startNextWave,
			update:update
		};

	})();
})(window.game = window.game || {});
