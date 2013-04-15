// domui is a abstraction layer over dom ui elements and can be used to reflect
// the game state on the dom ui
(function(g){
	g.domui = (function(){
		// ================= Inner constructor functions ============
		// ==========================================================

		// ======================== Properties =======================
		// ===========================================================

		// ======================== Public Functions =================
		// ===========================================================

		/*
			Make
		*/

		var initDomUI = function(resetGameHandler){
			$("#tryagain-button").click(function(){
				resetgamehandler();
			})
		};

		// Update the player score on the dom ui
		var setPlayerScore = function(score){
			$("#score").text(score);
		};

		/* 
			Sets the number of player lives on the ui
		*/

		var setPlayerLives = function(lives){
			$("#lives").text(lives);
		};

		// Set the wave number on the dom ui
		var setWave = function(wave){
			$("#wave").text(wave);
		};

		// Set the number of enemies left on the current wave
		var setEnemiesLeft = function(enemies){
			$("#enemies").text(enemies);
		}

		// Set the elapsed time from the game start
		var setTimeElapsed = function(timeString){
			$("#time").text(timeString);
		};

		/* 
			Show the dom element with the remaining player lives
		*/

		var showPlayerLives = function(playerLives){
			$("#player-lives-message").slideDown();
			$("#livescount").text(playerLives);
		};

		/*
			How the player lives dom element
		*/

		var hidePlayerLives = function(){
			$("#player-lives-message").slideUp();
		};

		/*
			Show the game over overlay
		*/

		var showGameOverOverlay = function(score, wave){
			// hide any other dom elements
			$("#player-lives-message").hide();

			// set scoring and wave
			$("#gameover-score").text(score);

			$("#gameover-wave").text(wave);

			$("#game-over-screen").slideDown();
		};

		/*
			Hides the game over screen overlay
		*/
		var hideGameOverOverlay = function(){
			$("#game-over-screen").hide();
		};

		// ======================== Private Functions =================
		// ===========================================================

		// ======================== RMP ==============================
		// ===========================================================

		return {
			setPlayerLives:setPlayerLives,
			setPlayerScore:setPlayerScore,
			setWave:setWave,
			setEnemiesLeft:setEnemiesLeft,
			setTimeElapsed:setTimeElapsed,

			showPlayerLives:showPlayerLives,
			hidePlayerLives:hidePlayerLives,

			showGameOverOverlay:showGameOverOverlay
		};

	})();
})(window.game = window.game || {});
