// we can create multiple projectile so we are going to 
// make the projectile a constructor function with prototype calls
(function (g){

	// the projectile constructor function that creates projectiles and handles
	// projectile animation and updates
	// params : 
	// 			- img,       the sprite used to draw the projectile
	// 			- x,         projectile x coordinate
	// 			- y,         projectile y coordinate
	// 			- speed,     projectie speed factor
	// 			- direction, projectile travel direction ( up, down)
	// 			- isEnemy,   is the projectile an enemy projectile
	var projectile = function(img, x, y, speed, direction, isEnemy){
		this.image = img;
		this.x = x || 0;
		this.y = y || 0;
		this.speed = speed || 1;
		this.direction = direction || 1;
		this.isEnemy = isEnemy || true;

		// so the entitiy manger knows this object is of type projectile
		this.type = "projectile";
	};

	// specify the prototype
	projectile.prototype = {};

	// the projectile class update function
	projectile.prototype.update = function(){
		this.y += this.direction * (this.speed * g.dt);
	};

	// the projectile class draw function
	projectile.prototype.draw = function(ctx){
		g.draw.DrawImage(ctx, this.image, this.x, this.y);
	};

	// returns true if the projectile is off the canvas
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

	// Return a bounding box for the projectile
	projectile.prototype.getBoundingBox = function(){
		var boundingBox = {};

		// setup the bounding box properties
		boundingBox.x = this.x;
		boundingBox.y = this.y;
		boundingBox.w = this.image.width;
		boundingBox.h = this.image.height;

		return boundingBox;
	};

	// namespace the projectile under the game namespace
	g.projectile = projectile;

})(window.game = window.game || {});