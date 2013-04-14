// The main enemy class
(function(g){
	var enemy = function(img, x, y, speed, rotation, doesFire){
		this.image = img;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.rotation = rotation || 0;
		this.doesFire = doesFire || false;

		// so the entitiy manger knows this object is of type enemy
		this.type = "enemy";
	};

	// setup the basic enemy prototype
	enemy.prototype = {};

	// the enemy class update function
	enemy.prototype.update = function(){
		this.y += (this.speed * g.dt);
	};

	// the enemy class draw function
	enemy.prototype.draw = function(ctx){
		g.draw.DrawImage(ctx, this.image, this.x, this.y, this.rotation);

		if(g.config.drawBoundingBoxes){
			g.draw.BoundingBox(ctx, this.getBoundingBox());
		}
	};

	// returns true if the enemy is off the canvas
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

	// Return a bounding box for the projectile
	enemy.prototype.getBoundingBox = function(){
		var boundingBox = {};

		// setup the bounding box properties
		boundingBox.x = this.x;
		boundingBox.y = this.y;
		boundingBox.w = this.image.width;
		boundingBox.h = this.image.height;

		return boundingBox;
	};

	// namespace the enemy class
	g.enemy = enemy;
})(window.game = window.game || {});