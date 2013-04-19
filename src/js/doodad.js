/*		
	The inner doodad constructor function used to represent special space
	effects and properties and bodies like asteroids or particle effects.
	
	The doodad entities are managed by the general entitiy manager, which 
	calls the update and draw functions for each seperate doodad.

	Doodads are generated and spawned by the doodad spawner.
*/

(function(g){

	/*
		The basic doodad constructor function that defines basic doodad properties
		that are to be seperate for each spawned doodad.

		Common functions are defined using the prototype aproach
	*/

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

	// define the basic prototype object for the doodad constructor function
	doodad.prototype = {};

	/*
		The doodad entitiy update function which currently only moves the doodad down the 
		screen vertically based on the doodads speed and the time elapsed from the last update/frame
	*/

	doodad.prototype.update = function(){
		this.y += (this.speed * g.dt * this.direction);
	};

	/*
		Draws the doodad on the canvas given with the canvas context.	
	*/

	doodad.prototype.draw = function(ctx){
		g.draw.DrawImage(ctx, this.image, this.x, this.y, this.rotation);
	};

	/*
		Allows client code to query if the doodad is out of the screen bounds for the main game canvas.

		Used by the entitiy manager to check and clear doodads that are no more visible on the screen
	*/

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

	// namespace the doodad constructor function
	g.doodad = doodad;
})(window.game = window.game || {});
