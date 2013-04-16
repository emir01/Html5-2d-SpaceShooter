// State is one of the main, if not the main, module that handles game state
// like keepint track of scores, player lives and etc..
(function(g){
	g.state = (function(){

		// ================= Inner constructor functions ============
		// ==========================================================

		// ======================== Properties =======================
		// ===========================================================

		// The current state of the players remaining lives
		var playerLives;

		// The current state of the players score
		var score;

		// The current state for the wave counter.
		var wave; 

		// The current state of the enemy count based on the wave state
		// Each wave will have an increasing number of enemies to be killed
		// to advance to the next wave
		var enemiesInWave;

		// The current state of the enemy spawn timer factor, which increased
		// based on the current wave
		var enemySpawnTime;

		// Flag used to determine when did the player start the current game session.
		// Used to control and display the elapsed time
		var startPlayTime;

		// Flag control variable for the number of milliseconds the player will be invurnerable on game start
		// and each time he looses a life
		var playerInvuTime = 5000;

		// Simple Flag controlling if the game is in the game over state.
		// NOTE NOTE NOTE !!!! Should refactor to an "enum" type of state control, with multiple states
		// once Screens/Menus/Pause/Instruction options are added
		var gameOver = false;

		// ======================== Public Functions =================
		// ===========================================================

		/*
			Resets the game state tracking. Used on game initializatino to initially set all the properties
			and on game restarts to revert to the original starting state
		*/

		var setState = function(){
			
			resetStateProperties();
			
			resetClock();
		};

		/*
			As the State is an "entitiy" like object that gets updated on each "frame"
			it has an update call which can be called from the main game loop.
		*/

		var update = function(){
			setTimeElapsed();
		};

		/*
			The state objects draw method, which is not actually implemented as state does not
			have anything to draw
		*/

		var draw = function(ctx){

		};

		/*
			Notifies state that an enemy has been destroyed and that it should properly update
			progress state information: score and wave counters.
		*/

		var enemyDestroyed = function(){
			setPlayerScore();
			checkWaveCounters();
		};

		/*
			Notifies state that the player has been hit. State will update player lives and check for game over condition
			as well as update UI elements
		*/

		var playerHit = function(){
			playerLives--; 
			g.domui.setPlayerLives(playerLives);

			if(playerLives == 0){
				gameOver = true;
			}
		};

		// ======================== Private Functions =================
		// ============================================================

		/*
			Reset state properties both internally and updates the UI using the DOM UI control.
			Resets only properties that control game state and game variables.
		*/

		var resetStateProperties = function(){
			
			// Player state properties reset
			playerLives = 3;
			g.domui.setPlayerLives(playerLives);

			// Score state properties reset
			score = 0;
			g.domui.setPlayerScore(score);

			// Spawner state properties
			wave = 1;
			g.domui.setWave(1);
			
			// Wave counter properties reset
			enemiesInWave = 10;
			g.domui.setEnemiesLeft(enemiesInWave);

			// Miscelenious state property resets and initialization
			enemySpawnTime = 0.5;

			playerInvuTime = 5000;

			gameOver = false;
		};

		/*
			Reset the starting time clock used to track time from last game start
		*/

		var resetClock = function(){
			startPlayTime  = new Date();
		};

		/* 
			Calculates the elapsed time from the last time the player started or reset the game.
			Called from the state update call it will as well set the dom UI to display the correct time.
		*/

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


		/*
	 		Updates the player score. Usually called each time and enemy is detroyed.
	 		The new score is updated on the dom UI 
		*/

		var setPlayerScore = function(){
			score = score + (wave * 10);
			g.domui.setPlayerScore(score);
		};

		/*
			Check if we need to start a new wave based on the wave counters. If so wave information is updated both 
			internally and on the dom UI.

			On wave change the spawner is notified to start spawning with the updated spawn information
		*/
		
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

		// ======================== Accessors =========================================
		// Because of issues with javascript closures we use functions
		// to access internal properties 

		var getSpawnTime = function(){
			return enemySpawnTime;
		};

		var getPlayerLives = function(){
			return playerLives;
		};

		var getPlayerScore = function(){
			return score;
		};

		var getCurrentWave = function(){
			return wave;
		};

		var isGameOver = function(){
			return gameOver;
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

			getPlayerLives:getPlayerLives,
			getPlayerScore:getPlayerScore,
			getCurrentWave:getCurrentWave,
			playerInvuTime:playerInvuTime,

			isGameOver:isGameOver
		};

	})();

})(window.game = window.game || {});
