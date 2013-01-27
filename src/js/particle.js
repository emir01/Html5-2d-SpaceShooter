// Simple quasi particle system manager that handles displaying "particle" related entiteis
// like explosions and engine traisl and etc
(function(g){
	g.particle = (function(){
		// ================= Inner constructor functions ============
		// ==========================================================

		// The simplest particle system containing a sprite that gets
		// draw and fakes a real particle system.
		//---
		// Handles grid ordered sprite sheets.
		// w and h are defined to help create an x, y offset by on the provided dimension
		var spriteParticleSystem = function(x, y, img, rowCount, columnCount, speed, w, h){
			this.x = x;
			this.y = y;

			this.image = img;

			this.rowCount = rowCount;
			this.columnCount = columnCount;

			// the total number of frames
			this.totalFrames = rowCount * columnCount;

			// used to keep track of rendering
			this.currentFrame = 0;

			// The width and height of one image in the sprite sheet
			this.calcWidth =  Math.floor(img.width / columnCount);
			this.calcHeight = Math.floor(img.height / rowCount);

			// if the dimensions are defined we are going to offset the x and y cords
			// to render the sprite system in a more centralized position
			if(typeof w !== "undefined" && typeof h !== "undefined"){
				this.x += ((w / 2) -  this.calcWidth / 2);
				this.y += ((h / 2) - this.calcWidth / 2);
			}

			this.speed = speed;
		};

		// ---- Setup the sprite particle prototype

		spriteParticleSystem.prototype = {};

		// The sprite particle system update function that updates 
		// the sprite frame and timer information.
		spriteParticleSystem.prototype.update = function(){
			// update the frame for the sprite particle
			this.currentFrame++;
		};

		// Check if the sprite system should die and be killed by the
		// sprite system manager
		spriteParticleSystem.prototype.shouldDie = function(){
			// we are going to kill the sprite particle system on the "last frame"
			return this.currentFrame == this.totalFrames;
		};
 
		// The sprite particle system draw function 
		// that draws the simple particle system
		spriteParticleSystem.prototype.draw = function(ctx){
			// draw the current frame in the sprite 
			// use the native canvas draw image to handle sprite cutout

			// Get the source X by geting the current frame remainder from the total frames
			// and the total number of columns multipled by a single image width
			var sourceX = ((this.currentFrame - 1) % this.columnCount) * this.calcWidth;
			
			// Get the sourceY by first gettint the row in which the current frame is in by 
			// dividing the current frame number by the number of "frames" that fit on a row ( the column number)
			// Uset  math floor to avoid rounding issues

			var currentRow = (Math.floor((this.currentFrame - 1) / this.columnCount) % this.rowCount);
			var sourceY =  currentRow * this.calcHeight;

			ctx.drawImage(
				this.image, // the image we are going to draw
				sourceX,
				sourceY,
				this.calcWidth, // the source width
				this.calcHeight, // the source height
				this.x, // the canvas location x cord
				this.y, // the canvas location y
				this.calcWidth, // the canvas width - same as source
				this.calcHeight // the canvas height - same as source
			);
		};

		// ======================== Properties =======================
		// ===========================================================

		// keeps track of all the particle systems 
		// in the particle system manage
		var particleSystems = [];

		// ======================== Public Functions =================
		// ===========================================================

		// the main update function for the particle system manager
		var update = function(ctx){

			// go through all the particle systems and their update calls
			for(var i = 0; i < particleSystems.length; i++){
				// call the update for the particle system
				var particleSystem = particleSystems[i];

				particleSystem.update();

				// check if the particle system needs to die
				if(particleSystem.shouldDie()){
					particleSystems.splice(i, 1);
					delete particleSystem;
				}
			}
		};

		// the main draw function for the particle system manager
		var draw = function(ctx){
			
			// go through all the particle systems and their draw calls
			for(var i = 0; i < particleSystems.length; i++){
				var particleSystem = particleSystems[i];
				particleSystem.draw(ctx);
			}
		};

		//	 Create an enemy explosion particle effect at the given coordinates

		var enemyExplosion = function(x, y, w, h){

			//create an sprite entitiy system
			var explosion = g.assets.explosion;

			var spriteSystem = new spriteParticleSystem
			(
				x,         // the x cord on the canvas where to render the particle system
				y,         // the y cord on the canvas where to render the particle system
				explosion, // the sprite particle system required image
				3,         // the number of rows on the image
				8,         // the number of individual images ( columns ) in each row
				1,          // the rendering speed
				w,		   // the width of the element the sprite system will be "replacing"
				h          // the height of the element the sprite system will be "replacing"
			);

			// add the enemy explosion sprite particle system
			// to the managed particle systems

			particleSystems.push(spriteSystem);
		};

		// ======================== Private Functions =================
		// ===========================================================

		// ======================== RMP ==============================
		// ===========================================================

		return {
			update:update,
			draw:draw,
			enemyExplosion:enemyExplosion
		};

	})();

})(window.game = window.game || {});
