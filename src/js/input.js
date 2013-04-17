/*
	The main 
*/
(function (g) {
	g.input = {};

	// setup the key binding
	g.input.keys = {
		37:"left",
		65:"left",
		39:"right",
		68:"right",
		87:"up",
		83:"down",
		32:"fire"
	};

	// the current key state for the given keys
	g.input.keyState  = {
		"left":false,
		"right":false,
		"up":false,
		"down":false,
		"fire":false
	};

	g.input.keyDown  = {
		"left":  {down:false, reset:true},
		"right": {down:false, reset:true},
		"up":    {down:false, reset:true},
		"down":  {down:false, reset:true},
		"fire":  {down:false, reset:true}
	};

	// used to query if a certain key was fully pressed and released
	// can be used to check for fire events
	g.input.wasKeyFull = function(action){
		var wasKeyFull = g.input.keyDown[action].down;

		// if we have a record for the action 
		if(typeof wasKeyFull === "boolean"){
			if(wasKeyFull === true){
				g.input.keyDown[action].down = false;
				return true;
			}
			else{
				return false;
			}
		}
	};
	
	// hook onto the document when the dom is ready
	$(document).on('keydown', function(e){
		var keyMapping =  g.input.keys[e.which];
		if(typeof keyMapping === "string"){
			g.input.keyState[keyMapping] = true;			

			// checks to prevent multiple times setting the down
			// state to true
			if(g.input.keyDown[keyMapping].reset){
				g.input.keyDown[keyMapping].down = true;
				g.input.keyDown[keyMapping].reset = false;
			}
		}
	});

	$(document).on('keyup', function(e){
		var keyMapping =  g.input.keys[e.which];
		if(typeof keyMapping === "string"){
			g.input.keyState[keyMapping] = false;

			g.input.keyDown[keyMapping].reset = true;
		}
	});

})(window.game = window.game || {});