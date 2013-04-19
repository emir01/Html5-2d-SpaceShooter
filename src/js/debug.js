/*
	Module containing simple centralized debugging utilities.
*/
(function(g){
	g.dbg = (function(){

		/*
			Public functions
			===============================================
		*/

		/*
			Logs the simple message on the console.
		*/	

		var log = function(msg){
			console.log(msg);
		};

		/*
			RMP
			===============================================
		*/

		return {
			// Logging utilities
			log:log
		};
	})();
})(window.game = window.game || {});