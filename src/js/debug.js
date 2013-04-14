(function(g){
	// setup debug functions to the main game object
	g.dbg = (function(){

		var log = function(msg){
			console.log(msg);
		};

		return {
			log:log
		};
	})();
})(window.game = window.game || {});