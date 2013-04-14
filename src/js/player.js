// Defines the main player object
(function (g) {
	g.player =  (function(){
		// player coordinates
		var x = 100;
		var y = 100;

		// player properties
		var speed = 0.5;

		// player dimensions
		var width = 50;
		var height = 50;

		// The current active player image to be drawn
		// depending on the player movement
		var activeImage;

		// keep track of player projectiles
		var projectiles = [];

		// Player can be destroyed
		var playerCanBeHit = true;

		// flag for actually drawing the player, which can be used 
		// to implement blinking
		var drawPlayer = true;

		// player functions : 

		// the initial player load function
		var reset = function () {
			activeImage = g.assets.player;

			width = g.assets.player.width;
			height = g.assets.player.height;

			x = g.canvas.width / 2 - (width / 2);
			y = g.canvas.height - 90;
		};

		/*
			The player has been hit, his position will have to be reset and state set accordingly
		*/

		var playerHit = function(){

			if(playerCanBeHit){
				reset();

				g.state.playerHit();

				playerCanBeHit = false;

				setTimeout(function(){
					playerCanBeHit = true;
				}, g.state.playerInvuTime);
			}

		};

		// update the player state based on pressed keys
		var update = function(){
			var keyStates = g.input.keyState;

			if(keyStates["left"]){
				x -= speed * g.dt;
				activeImage = g.assets.playerLeft;
			}
			else if(keyStates["right"]){
				x += speed * g.dt;
				activeImage = g.assets.playerRight;
			}
			else{
				// if we dont move
				activeImage = g.assets.player;
			}

			if(g.input.wasKeyFull("fire")){
				fireLaserSound();
				playerFireWeapon();
			}

			// Blinking section if the player cannot be hit
			if(!playerCanBeHit){

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
				drawPlayer = true;
			}
		};

		/*
			Return a player bounding box. We are going to be returning a collection of bounding boxes,
			to make the collision more complex

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

		var playerIsHittable = function(){
			return playerCanBeHit;
		};

		// draw the player on the given canvas context
		var draw = function(ctx){

			if(drawPlayer){
				g.draw.DrawImage(ctx, activeImage, x, y);

				if(g.config.drawBoundingBoxes){
					g.draw.BoundingBox(ctx,getBoundingBox());
				}
			}
		};

		// ========================== PRIVATE FUNCTIONS ==========================

		// Fire tghe laser sound using multiple buzz audio objects
		// Should be better optimized later on
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

		// handle player fire functionality.
		var playerFireWeapon = function(){
			
			// create a projectile
			var projectile  = new g.projectile(
				g.assets.laserGreen, // projectile image
				(x + width / 2) - (g.assets.laserGreen.width/2), // projectile x
				y - g.assets.laserGreen.height, // projectile y
				0.5, // projectile speed
				-1,
				false
			);	

			// Add the projectile to the entitiy manager
			g.emanager.addEntity(projectile);
		};

		return {
			x:x,
			y:y,
			w:width,
			h:height,
			reset:reset,
			update:update,
			draw:draw,
			getBoundingBox:getBoundingBox,
			playerIsHittable:playerIsHittable,
			playerHit:playerHit
		};
	})();

})(window.game = window.game || {});