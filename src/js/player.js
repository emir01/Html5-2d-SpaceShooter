/*
	Defines the main player object and functionality used to control the player ship. 

	The player code is ideal for implementing the RMP from the MODULE_TEMPLATE file, but is one of the earliest written files,
	and it does not really adhere to the organization, though in a way it does implement RMP
*/

(function (g) {
	g.player =  (function(){

		/*
			Basic player properties and inner player state variables
		*/

		var x = 100;
		var y = 100;

		// The player speed 
		var speed = 0.7;

		var width = 50;
		var height = 50;

		// Internal player config properties
		var playerProjectileSpeed = 0.7

		// control how much will the player appear on the opposite side when 
		// exiting from the left or right.
		var teleportMargin = 25;

		// Flag internally controlling if the player can be hit, that is if he is currently invurnerable to enemy ships 
		// and projectiles
		var playerCanBeHit = true;

		// Internal draw flag used to implement the blinking while the player is invulnerable
		var drawPlayer = false;

		/*
			The current active player image to be drawn
			depending on the player movement. This will be changed as the player moved to the left or the the right
		*/
		var activeImage;

		/*
			====================================================================================
			Basic player functions and methods. Public functions thnat are accessible from 
			the main game loop and other modules
			====================================================================================
		*/

		/*	
			The initial player load function that resets some of the player inner variables
			for both position and state.
		*/

		var reset = function () {
			activeImage = g.assets.player;

			width = g.assets.player.width;
			height = g.assets.player.height;

			x = g.canvas.width / 2 - (width / 2);
			y = g.canvas.height - 90;
		};

		/*
			The player has been hit, his position will have to be reset and state set accordingly.
			Should be called from outside modules that handle collisions and detect when the player is hit.
		*/

		var playerHit = function(){
			// We are going to check if the player can initially be hit and if so
			// reset player internal tracking variables and update State
			if(playerCanBeHit){
				reset();

				g.state.playerHit();

				// We set the can be hit flag to false and setup a timeout call
				// that will revert it for the given State defined time. For the 
				// next period the player will be invurnerable
				playerCanBeHit = false;
				setTimeout(function(){
					playerCanBeHit = true;
				}, g.state.playerInvuTime);
			}
		};

		/*
			The update method is called from the main game loop and allows the player entitiy to process what is going on with the game
			and the input and update internal tracking variables accordingly.

			Its main use is to check for input on the game controls and update player ship position and actions.

			Update will also handle the visual blinking when the ship cannot be hit by updating an itnernal drawPlayer variable
			which is then used in the draw function to switch drawing visibility.
		*/
		
		var update = function(){
			// Get key states and update player accorindg to input
			var keyStates = g.input.keyState;

			var canvasWidth = g.canvas.width;
			
			if(keyStates["left"]){
				x -= speed * g.dt;
				activeImage = g.assets.playerLeft;

				// we need to determine if the player went fully of screen to the 
				// left side, and if so move him to appear on the right side of the screen.

				if(x <= 0 - width){
					// subtract the five so it becomes more visible on the right side.
					x = canvasWidth - teleportMargin;
				}

			}
			else if(keyStates["right"]){
				x += speed * g.dt;
				activeImage = g.assets.playerRight;

				// same as when going to the left, we are checking if the player
				// moved out of the screen on the right side.
				if(x >= canvasWidth){
					x = (0 - width) + teleportMargin;
				}
			}
			else{
				// if we dont move
				activeImage = g.assets.player;
			}

			// If the fire binding was pressed and released indicating
			// a full key action.
			if(g.input.wasKeyFull("fire")){
				fireLaserSound();
				playerFireWeapon();
			}

			// Blinking section if the player cannot be hit
			if(!playerCanBeHit){

				g.domui.showPlayerLives(g.state.getPlayerLives());

				if(drawPlayer){
					setTimeout(function(){
						drawPlayer = false;
					}, 150)
				}
				else{
					setTimeout(function(){
						drawPlayer = true;
					}, 150)
				}
			}
			else{
				g.domui.hidePlayerLives();
				drawPlayer = true;
			}
		};

		/*
			The main player entity draw function that is reposinbie for displaying the player
			ship sprite on the canvas
		*/	

		var draw = function(ctx){

			if(drawPlayer){
				g.draw.DrawImage(ctx, activeImage, x, y);

				if(g.config.drawBoundingBoxes){
					g.draw.BoundingBox(ctx,getBoundingBox());
				}
			}
		};

		/*
			Return a player bounding box. We are going to be returning a collection of bounding boxes,
			to make the collision more accurate for the player entitiy

			The multiple values are manually calculated from the sprites for the enemy and players
		*/

		var getBoundingBox = function() {

			var boundingBoxCollection = [];

			// Add the hull bounding box
			var boundingBoxHull = {};

			boundingBoxHull.x = x + 40;
			boundingBoxHull.y = y;

			boundingBoxHull.w = 18;
			boundingBoxHull.h = activeImage.height;

			boundingBoxCollection.push(boundingBoxHull)
			// --------------------------------------------------

			// Add the wings bounding box
			var boundingBoxWings = {};

			boundingBoxWings.x = x;
			boundingBoxWings.y = y + 31;

			boundingBoxWings.w = activeImage.width;
			boundingBoxWings.h = 31;

			boundingBoxCollection.push(boundingBoxWings)
			// ---------------------------------------------------

			return boundingBoxCollection;
		};

		/*
			====================================================================================
			Getter and setter functions that return/manage/edit internally tracked palyer state properties
			====================================================================================
		*/

		/*
			Returns the current state of the playerCanBeHit property
		*/

		var playerIsHittable = function(){
			return playerCanBeHit;
		};

		/*
			Sets the player hittable properties. This would allow outer modules to alter the player hittable state.
			Notably used from higher level modules when controling major game flow. Resetting the game and decreasing player lives
			are examples of such actions
		*/

		var setPlayerHittable = function(state){
			
			// if the player is invu set the hittable to false
			if(g.config.playerIsInvu){
				playerCanBeHit = false;
				return;
			}

			playerCanBeHit = state;
		};

		/*
			========================== PRIVATE FUNCTIONS ==========================

			Containing internal player functions and utilities called upon from the rest
			of the player functionality.
		*/

		/*	
			Handles the palyers fire projectile functionality by creating a projectile
			entitiy that is then added and handled by the projectile manager.
		*/
		var playerFireWeapon = function(){
			
			// create a projectile
			var projectile  = new g.projectile(
				g.assets.laserGreen, // projectile image
				(x + width / 2) - (g.assets.laserGreen.width/2), // projectile x
				y - g.assets.laserGreen.height, // projectile y
				playerProjectileSpeed, // projectile speed
				-1,
				false
			);	

			// Add the projectile to the entitiy manager
			g.emanager.addEntity(projectile);
		};

		/*
			Fires the laser sound on each player fire action. The function is schecking
			and using multiple sound assets to cope with the players multiple spacebar
			mashing. 

			With one sound the firing was choppy and cut off
		*/
		var fireLaserSound = function(){
			if(g.config.soundEnabled){
				if(g.assets.soundLaser1.isEnded() || g.assets.soundLaser1.isPaused()){
					g.assets.soundLaser1.play();	
				}
				else if(g.assets.soundLaser2.isEnded() || g.assets.soundLaser2.isPaused()){
					g.assets.soundLaser2.play()
				}
				else if(g.assets.soundLaser3.isEnded() || g.assets.soundLaser3.isPaused()){
					g.assets.soundLaser3.play()
				}
				else if(g.assets.soundLaser4.isEnded() || g.assets.soundLaser4.isPaused()){
					g.assets.soundLaser4.play()
				}
			}
		};

		/*
			Player internal state getters. These should be used instead of the raw properties
			because of closures. Trying to get raw coordinate properties for example will return the 
			original values
			========================================================================================
		*/

		var getX = function(){
			return x;
		};

		var getY = function(){
			return y;
		};

		var getW = function(){
			return width;
		};

		var getH = function(){
			return height;
		};

		/*
			RMP
			==========================================================================================
		*/

		return {
			// Basic player properties and methods
			x:x,
			y:y,
			w:width,
			h:height,
			getBoundingBox:getBoundingBox,

			// Player basic state property getters
			getX:getX,
			getY:getY,
			getW:getW,
			getH:getH,

			// Initialization and reset methods
			reset:reset,

			// Main game loop player methods
			update:update,
			draw:draw,

			// Utility player getter functions
			playerIsHittable:playerIsHittable,
			setPlayerHittable:setPlayerHittable,

			// Player state methods, that are related with the game state.
			playerHit:playerHit
		};
	})();
})(window.game = window.game || {});