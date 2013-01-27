// The inner doodad class used to represent special space
// effects and properties and bodies like asteroids or particle effects.
// Used by the doodad manager
(function(g){
	var doodad = function(img, x, y, speed, direction, rotation, doesDamage){
		this.image = img;
		this.x = x || 0;
		this.y = y || 0;
		this.speed = speed || 1;
		this.direction = direction || 1;
		this.rotation = rotation || 0;
		this.doesDamage = doesDamage || false;

		// so the entitiy manger knows this object is of type doodad
		this.type = "doodad";
	};

	doodad.prototype = {};

	// the doodad class update function
	doodad.prototype.update = function(){
		this.y += (this.speed * g.dt * this.direction);
	};

	// the doodad class draw function
	doodad.prototype.draw = function(ctx){
		g.draw.DrawImage(ctx, this.image, this.x, this.y, this.rotation);
	};

	// returns true if the doodad is off the canvas
	doodad.prototype.isOffScreen = function(){
		var y = this.y;

		var imageHeight = this.image.height;
		var canvasHeight = g.canvas.height;

		// if the doodad is fully bellow the top edge of the canvas
		// where the Y cord is 0;
		if(y + imageHeight < 0){
			return true;
		}
		// if a doodad coming down is fully bellow the bottom
		// edge of the canvas
		else if(y > canvasHeight + imageHeight){
			return true;
		}
		// otherwise the doodad is still on the screen
		else{
			return false;
		}
	};

	// namespace the doodad class
	g.doodad = doodad;
	
})(window.game = window.game || {});
