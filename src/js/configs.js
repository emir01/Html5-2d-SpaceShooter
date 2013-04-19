/*
	Contains centralized game configuratino options that can be used during gameplay and development
	to control certain game aspects.
*/

(function(g){
	g.config = (function(){
		
		/*
			Configurations and options
			============================================================
		*/		

		/*
			Controls if sounds are enabled. Queries by sound playing code to determine if any sounds
			should be played at all.
		*/

		var soundsEnabled = false;

		/*
			Controls if we will be drawing bounding boxes mimicing a debug mode
			for the entities being drawn
		*/

		var drawBoundingBoxes = false;

		/*
			RMP
			============================================================
		*/
		
		return {
			soundEnabled:soundsEnabled,
			drawBoundingBoxes:drawBoundingBoxes
		};
	})();
})(window.game = window.game || {});
