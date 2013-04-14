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

		// player functions : 

		// the initial player load function
		var reset = function () {

			activeImage = g.assets.player;

			width = g.assets.player.width;
			height = g.assets.player.height;

			x = g.canvas.width / 2 - (width / 2);
			y = g.canvas.height - 90;
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
		};

		/*
			Return a player bounding box. We are going to be returning a collection of bounding boxes,
			to make the collision more complex
		*/
		var getBoundingBox = function() {

			var boundingBoxCollection = [];
		
			var boundingBox = {};

			// setup the bounding box properties
			boundingBox.x = x;
			boundingBox.y = y;
			boundingBox.w = activeImage.width;
			boundingBox.h = activeImage.height;

			return boundingBox;
		};

		// draw the player on the given canvas context
		var draw = function(ctx){
			g.draw.DrawImage(ctx, activeImage, x, y);
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
			reset:reset,
			update:update,
			draw:draw,
			getBoundingBox:getBoundingBox
		};
	})();

})(window.game = window.game || {});