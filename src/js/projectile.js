/*
	Code file for the projectile entitiy, that is used to draw/update projectiles for both enemies and the player.

	Currently only used for player projectiles.

	As we need more that one projectile, contrary to spawner and entitiy manager modules, we will be creating
	a constructor function and prototype method definition. This will allow us to create more that one projectile

*/

(function (g){
	/* 
		The projectile constructor function that creates projectiles and handles
	 	projectile animation and updates
	 	params : 
	 			- img,       the sprite used to draw the projectile
	 			- x,         projectile x coordinate
	 			- y,         projectile y coordinate
	 			- speed,     projectie speed factor
	 			- direction, projectile travel direction ( up, down)
	 			- isEnemy,   is the projectile an enemy projectile
	*/

	var projectile = function(img, x, y, speed, direction, isEnemy){
		this.image = img;
		this.x = x || 0;
		this.y = y || 0;
		this.speed = speed || 1;
		this.direction = direction || 1;
		this.isEnemy = isEnemy || false;

		// The Entitiy manager will know this object is of type projectile
		this.type = "projectile";
	};

	/*
		Specify the basic prototype object
	*/

	projectile.prototype = {};

	/*
		The projectile update function that currently only moves the projectile vertically up  the screen
	*/

	projectile.prototype.update = function(){
		this.y += this.direction * (this.speed * g.dt);
	};

	/*
		The projectile class draw function that simply draws the projectile image.
	*/

	projectile.prototype.draw = function(ctx){
		g.draw.DrawImage(ctx, this.image, this.x, this.y);
	};

	/*
		Returns true if the projectile is off the canvas. If it is off the screen the entitiy manager will remove the projectile
		improving performance
	*/ 
	projectile.prototype.isOffScreen = function(){
		var y = this.y;
		var imageHeight = this.image.height;
		var canvasHeight = g.canvas.height;

		// if the projectile is fully bellow the top edge of the canvas
		// where the Y cord is 0;
		if(y + imageHeight < 0){
			return true;
		}
		// if a projectile coming down is fully bellow the bottom
		// edge of the canvas
		else if(y > canvasHeight){
			return true;
		}
		// otherwise the projectile is still on the screen
		else{
			return false;
		}
	};

	/*
		Return a bounding box for the projectile, used in collision calculations in the entitiy manager code
	*/

	projectile.prototype.getBoundingBox = function(){
		var boundingBox = {};

		// setup the bounding box properties
		boundingBox.x = this.x;
		boundingBox.y = this.y;
		boundingBox.w = this.image.width;
		boundingBox.h = this.image.height;

		return boundingBox;
	};

	/*
		Namespace the projectile under the game namespace. We can then use "new g.projectile(params)" to create and add new projectiles
		to the entitiy manager
	*/
	g.projectile = projectile;

})(window.game = window.game || {});