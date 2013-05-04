/*
	Domui is a abstraction layer over specific dom ui elements and can be used to reflect
	the game state on the dom ui.

	The specific dom elements and overlays are used to display specific game state information.
*/

(function(g){
	g.domui = (function(){
		// ================= Inner constructor functions ============
		// ==========================================================

		// ======================== Properties =======================
		// ===========================================================

		// ======================== Public Functions =================
		// ===========================================================

		/*
			Initialize the dom ui, linkin all the related events to the passed in 
			event handlers.

			The main game initialization can use the Domui init to pass in state handlers
			for specific game state change moments.

			The Domui module will from there on setup appropriate handlers for the specific elements.
		*/

		var initDomUI = function(resetGameHandler){
			$("#tryagain-button").click(function(){
				resetGameHandler();
			});

			$("#restart-button").click(function(){
				resetGameHandler();
			});
		};

		/*
			Set individual domui element values.
			================================================================================================================
			The following methods set game state values to individual domui elements. The elements are usually at the sides
			of the main game canvas and server as a simple stats overview for the game state.

		*/	

		/*
			Set the player score on the specific player score domui element
		*/

		var setPlayerScore = function(score){
			$("#score").text(score);
		};

		/* 
			Sets the number of player lives on the specific domui element
		*/

		var setPlayerLives = function(lives){
			$("#lives").text(lives);
		};

		/*
			Set the current wave count on the specific domui element
		*/

		var setWave = function(wave){
			$("#wave").text(wave);
		};

		/*	
			Set the number of enemies left on the current wave on the specific domui element
		*/	

		var setEnemiesLeft = function(enemies){
			$("#enemies").text(enemies);
		}

		/*
			Set the elapsed time from the game start on the specific domui element
		*/
		
		var setTimeElapsed = function(timeString){
			$("#time").text(timeString);
		};

		/*	
			Overlays
			========================================================================================================================
			Displaying and hiding overlays that are imposed over the main game canvas and usually displayed withing timings 
			using setTimeout.
		*/

		/* 
			Show the domui overlay with the remaining player lives count.

			The overlay is set over the canvas with absolute positioning, and is slided down using
			jquery animations.

			The overlay therefore is a combination of javascript/jquery and css.
		*/

		var showPlayerLives = function(playerLives){
			$("#livescount").text(playerLives);
			$("#player-lives-message").slideDown();
		};

		/*
			Hide the player lives domui overlay
		*/

		var hidePlayerLives = function(){
			$("#player-lives-message").slideUp();
		};

		/*
			Show the game over domui overlay. The game over overlay is displayed when player lives reac 0.

			The game over overlay is hidden when a new game is started, in which case the clearOverlays function is called
		*/

		var showGameOverOverlay = function(score, wave, time){
			// hide any other dom elements
			$("#player-lives-message").hide();

			// set scoring and wave
			$("#gameover-score").text(score);

			$("#gameover-wave").text(wave);

			$("#gameover-time").text(time);

			$("#game-over-screen").slideDown();
		};

		/*
			Hides the game over domui overlay
		*/

		var hideGameOverOverlay = function(){
				$("#game-over-screen").hide();
		}
		
		/*
			Clear and hide all the displayed overlays. Called on game initialization and on game restart either
			after the game over state, or during gameplay using the specific domui action elements linked to the 
			restart game event handler
		*/

		var clearOverlays = function(){
			hideGameOverOverlay();
		};

		// ======================== Private Functions =================
		// ===========================================================

		// ======================== RMP ==============================
		// ===========================================================

		return {
			// Initialization
			initDomUI:initDomUI,

			// Individual game state setters
			setPlayerLives:setPlayerLives,
			setPlayerScore:setPlayerScore,
			setWave:setWave,
			setEnemiesLeft:setEnemiesLeft,
			setTimeElapsed:setTimeElapsed,

			// Overlays
			showPlayerLives:showPlayerLives,
			hidePlayerLives:hidePlayerLives,

			showGameOverOverlay:showGameOverOverlay,
			hideGameOverOverlay:hideGameOverOverlay,

			// Utility functions
			clearOverlays:clearOverlays
		};
	})();
})(window.game = window.game || {});
