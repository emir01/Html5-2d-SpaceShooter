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

		// Update the player score on the dom ui
		var setPlayerScore = function(score){
			$("#score").text(score);
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

		// ======================== Private Functions =================
		// ===========================================================

		// ======================== RMP ==============================
		// ===========================================================

		return {
			setPlayerScore:setPlayerScore,
			setWave:setWave,
			setEnemiesLeft:setEnemiesLeft,
			setTimeElapsed:setTimeElapsed
		};
	})();
})(window.game = window.game || {});
