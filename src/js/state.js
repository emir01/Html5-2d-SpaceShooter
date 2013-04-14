// State is one of the main, if not the main, module that handles game state
// like keepint track of scores, player lives and etc..
(function(g){
	g.state = (function(){
		// ================= Inner constructor functions ============
		// ==========================================================

		// ======================== Properties =======================
		// ===========================================================

		// The number of player lives
		var playerLives;

		// The number
		var score;

		// the initial wave number
		var wave; 

		// Number of enemies in initial enemy wave
		var enemiesInWave;

		// the starting enemy spawn time in seconds used by the spawner
		// in seconds
		var enemySpawnTime;

		// When did the player start to play
		var startPlayTime;

		// number of milliseconds the player is invurnerable
		// after he is hit
		var playerInvuTime = 5000;


		// ======================== Public Functions =================
		// ===========================================================

		// start/restart state tracking by seting initial state properties
		var setState = function(){
			resetStateProperties();
			resetModules();
			
			resetClock()
			g.emanager.reset();
		};

		// the main state manager update call
		var update = function(){
			setTimeElapsed();
		};

		// the main state manager draw call
		var draw = function(ctx){

		};

		// Update the players score by currently a fix ammount of 10
		var enemyDestroyed = function(){
			setPlayerScore();
			checkWaveCounters();
		};

		/*
			Update the player lives
		*/

		var playerHit = function(){
			playerLives--; 

			if(playerLives == 0){

			}

			g.domui.setPlayerLives(playerLives);
		}

		// ======================== Private Functions =================
		// ============================================================

		// helper function that resets state properties
		var resetStateProperties = function(){
			// player state properties
			playerLives = 3;
			g.domui.setPlayerLives(playerLives);

			score = 0;
			g.domui.setPlayerScore(score);

			// spawner state properties
			wave = 1;
			g.domui.setWave(1);
			
			enemiesInWave = 10;
			g.domui.setEnemiesLeft(enemiesInWave);

			enemySpawnTime = 0.5;
		};

		// helper function that resets modules like entitiy managers
		// and the actual player
		var resetModules = function(){
			g.emanager.reset();

			g.player.reset();
		};

		// Reset the starting time clock
		var resetClock = function(){
			startPlayTime  = new Date();
		};

		// Calculate elapsed time and set the gui
		var setTimeElapsed = function(){
			var now = new Date();

			var dif = new Date(now - startPlayTime);

			var seconds = dif.getSeconds();
			var minutes = dif.getMinutes();

			// check for '0' prefix
			if(seconds.toString().length == 1){
				seconds = "0"+seconds;
			}

			if(minutes.toString().length == 1){
				minutes = "0"+minutes;
			}

			var timeString = minutes +":"+seconds;
			g.domui.setTimeElapsed(timeString);
		};

		// Update the inner player score and update the ui
		var setPlayerScore = function(){
			score = score + (wave * 10);
			g.domui.setPlayerScore(score);
		};

		// Check if we need to start a new wave if enough enemies have been destroyed
		var checkWaveCounters = function(){
			enemiesInWave --;
			g.domui.setEnemiesLeft(enemiesInWave);

			if(enemiesInWave === 0){
				wave++
				g.domui.setWave(wave);

				enemiesInWave = wave * 10;
				g.domui.setEnemiesLeft(enemiesInWave);

				enemySpawnTime -= 0.05;

				g.spawner.startNextWave();
			}
		};

		// ======================== Accessors ========================
		// ========= Because of javascript closures we use gets ======
		var getSpawnTime = function(){
			return enemySpawnTime;
		};

		// ======================== RMP ==============================
		// ===========================================================

		return {
			// init
			setState:setState,

			// main loop
			update:update,
			draw:draw,

			//setters
			enemyDestroyed:enemyDestroyed,
			playerHit:playerHit,

			// getters
			getSpawnTime:getSpawnTime,
			playerInvuTime:playerInvuTime
		};

	})();

})(window.game = window.game || {});
