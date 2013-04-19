/*
	The main player input processor module. Provides functionality for detecting 
	and processing actions by the player  regarding controlling the game and the actions 
	on the canvas.
*/
(function (g) {

	/*
		Basic namespacing of the input module. As it was one of the early code files the
		RMP aproach was added later on so a more primitive aproach is used for defining the input object.

		The main difference is the lack of option for defining private members under g.input 
		that should not be visible from the outside
	*/	

	g.input = {};

	/*
		Maps javascript keyboard key bindings to more descriptive names that 
		are then used to process input and set key/action state.

		Allows us to map multiple keyboard controls to a single action or key state.
		For example:

		We have both the 'a' and 'left direction' keys mapped to the left action that moves
		the player ship to the left.
	*/

	g.input.keys = {
		37:"left",
		65:"left",
		39:"right",
		68:"right",
		87:"up",
		83:"down",
		32:"fire"
	};

	/*
		The key state object is used to track which of the possible actions or keys 
		are active.

		This key state object is then queried by client code to determine if an action has happened
		during the given frame/update call
	*/

	g.input.keyState  = {
		"left":false,
		"right":false,
		"up":false,
		"down":false,
		"fire":false
	};

	/*
		Not sure what this is supposed to do.
	*/

	g.input.keyDown  = {
		"left":  {down:false, reset:true},
		"right": {down:false, reset:true},
		"up":    {down:false, reset:true},
		"down":  {down:false, reset:true},
		"fire":  {down:false, reset:true}
	};


	/*
		Used to query if a certain key was fully pressed and released
		Can be used to check for fire events

		This part is a bit strange. On each wasKeyFull check which is probably
		going to happen on each update/frame the keyDown object is then reset.

		Probably needs refactoring and a better implementation of checking full key presses
		using some other javascript event handler.
	*/

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

	/*
		Internal key events atached to the document allowing the processing
		=======================================================

		Again as this file was before RMP usage, this would probably would have gone
		in a input.init() calll from the main game file.
	*/
	
	/*
		We are going to detect and process each key down event that .propagates to the document.

		We are ataching the jquery event handler on the document so we "get" all the events
	
		Bassically check if the key that was pressed is configured for an action in the keys
		object. If so the key state is set to true, and aditional checks are made to determine
		if the key was fully pressed and released in the current "frame"/update call

	*/

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

	/*
		We also atach to the key up document event to detect when a given key has been released
		at which point we reset the key state in the key down tracking object.
	*/
	$(document).on('keyup', function(e){
		var keyMapping =  g.input.keys[e.which];
		if(typeof keyMapping === "string"){
			g.input.keyState[keyMapping] = false;
			g.input.keyDown[keyMapping].reset = true;
		}
	});

})(window.game = window.game || {});