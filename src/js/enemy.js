/*
	The main enemy constructor function. The enemy is defined using a 
	constructor functiona as they are to be multiple enemies rendered on the screen
	and a single RMP aproach would not be valid.
*/

(function(g){

	/*
		Defines the main enemy constructor function
		that contain the basic enemy object properties including the image,
		initial positions, speed, rotation and state properties.

		Aditional functionality that should be accessible to the entitiy manager
		is defined via the prototpy eobject, which actually improves the memory consumption
		when creating multiple enemeies ( does not duplicate function objects )
	*/

	var enemy = function(img, x, y, speed, rotation, doesFire){
		// The enemy image that is drawn on the canvas
		this.image = img;

		// the enemy position variables
		this.x = x;
		this.y = y;

		this.speed = speed;
		this.rotation = rotation || 0;

		// The enemy firing variables for the specific enemy
		this.doesFire = doesFire || false;
		
		// controls the chance that the enemy that can fire, will fire at the current update call
		this.fireChance = 0.02;

		// Controls the rate of fire(ms). The enemy cannot fire more that one time per the value, which
		// at this case is one second.
		this.maxFireRate = 1000;

		// Flag controlling if the enemy can fire. Assosiated with the maxFireRate
		this.enemyCanFireAgain = true;

		// how much faster the projectile will be from the enemy that is firing it
		this.projectileSpeedBoost = 0.15;
		
		// so the entitiy manger knows this object is of type enemy
		this.type = "enemy";
	};

	// Initialize the prototype to a basic object.
	enemy.prototype = {};

	/*
		The main update call that is to be called from the main game loop or in this case
		the entitiy manager.

		Currently only moves the enemy down the canvas based on the enemy speed.
	*/	

	enemy.prototype.update = function(){
		this.y += (this.speed * g.dt);

		// It will give us a random value from 0 to 1 which we will check
		// against the enemy fire rate
		var enemyDoesFire = Math.random();
		if(enemyDoesFire <= this.fireChance){

			if(this.enemyCanFireAgain && this.doesFire) {
				
				// The enemy should fire a new projectile
				var enemyProjectile = new g.projectile(
				
				// Projectile image
				g.assets.laserRed, 
				
				// Projectile x calculated for the enemy ship firing the projectile
				(this.x + this.image.width / 2) - (g.assets.laserGreen.width/2), 

				// Projectile y calculated for the enemy ship firing the projectile
				this.y + this.image.height , 

				// Projectile speed is a bit more than the enemy speed
				this.speed + this.projectileSpeedBoost,
				
				// Set the direction to go down
				1, 

				// Is it an enemy projectile
				true);

				// Add the projectile to the entitiy manager
				g.emanager.addEntity(enemyProjectile);

				// Stop the enemy from firing again until the max fire rate time passes
				this.enemyCanFireAgain = false;

				// set the timeout to reset the fire flag
				// using an enemy reference because can't use 'this' in the callback function
				var enemy = this;			

				setTimeout(function(){
					enemy.enemyCanFireAgain = true;
				}, this.maxFireRate);
			}
		}
	};

	/*
		The main draw call for the enemy entitiy that is to be called from the main game loop
		or from the entity manager.

		Currently only displays/draws the enemey image on the given coordinates.
	*/

	enemy.prototype.draw = function(ctx){
		g.draw.DrawImage(ctx, this.image, this.x, this.y, this.rotation);

		if(g.config.drawBoundingBoxes){
			g.draw.BoundingBox(ctx, this.getBoundingBox());
		}
	};

	/*
		The enemy entitiy check that determines if the enemy is off the screen. Usable
		by entitiy manager code, to remove tracked enemy entities once they get of the screen
	*/

	enemy.prototype.isOffScreen = function(){
		var y = this.y;

		var imageHeight = this.image.height;
		var canvasHeight = g.canvas.height;

		// if the enemy is fully bellow the top edge of the canvas
		// where the Y cord is 0;
		if(y + imageHeight < 0){
			return true;
		}
		// if a enemy coming down is fully bellow the bottom
		// edge of the canvas
		else if(y > canvasHeight + imageHeight){
			return true;
		}
		// otherwise the enemy is still on the screen
		else{
			return false;
		}
	};

	/*
		 Return a bounding box for the enemy entity based on the position
		 and image dimensions.
	*/

	enemy.prototype.getBoundingBox = function(){
		var boundingBox = {};

		// setup the bounding box properties
		boundingBox.x = this.x;
		boundingBox.y = this.y;
		boundingBox.w = this.image.width;
		boundingBox.h = this.image.height;

		return boundingBox;
	};

	// namespace the enemy constructor function
	g.enemy = enemy;

})(window.game = window.game || {});