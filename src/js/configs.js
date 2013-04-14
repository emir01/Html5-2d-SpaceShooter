(function(g){
	g.config = (function(){
		/*
			Configurations and options
			============================================================
		*/		

		/*
			Controls the sound playing configuration
		*/

		var soundsEnabled = false;

		/*
			Controls if we will be drawing bounding boxes in a debug sort of mode
			for the entities being drawn
		*/

		var drawBoundingBoxes = true;

		return {
			soundEnabled:soundsEnabled,
			drawBoundingBoxes:drawBoundingBoxes
		};
	})();
})(window.game = window.game || {});
