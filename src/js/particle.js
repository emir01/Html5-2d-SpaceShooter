/*
	Simple quasi particle system manager that handles displaying "particle" related entiteis
    like explosions, engine trails and so on.

    The particle manager defines and is capable of handling the processing and drawing for 
    a given particle system.
*/	

(function(g){
	g.particle = (function(){
		
		/*	
		    Inner particle constructor functions
			==========================================================

			The following constructor and prototype functions are used to define the functionality
			for a series of particle system that can be handled by the Particle Manager (g.particle)

			Currently we only define a simple spriteParticle system that is based on sprite images and
			that is further documented bellow.
		*/

		/*
			The simplest particle system containing a sprite that gets
			draw and fakes a real particle system.
			
			Handles grid ordered sprite sheets.
			w and h are defined to help create an x, y offset by on the provided dimensions
		*/
		
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


		// Setup the sprite particle prototype base object
		spriteParticleSystem.prototype = {};

		/*
			The update call will just update the current frame for the sprite particle system.
			This allows the sprite to advance to the next image.
		*/

		spriteParticleSystem.prototype.update = function(){
			// update the frame for the sprite particle
			this.currentFrame++;
		};

		/*
			Check if the sprite system should die and be killed by the
			sprite system manager. 

			The sprite p. system is prepared to be removed when the last frame has been reached and drawn
		*/
		
		spriteParticleSystem.prototype.shouldDie = function(){
			return this.currentFrame == this.totalFrames;
		};

		/*
		 	The sprite particle system draw function 
			that draws the simple particle system frame by frame on each game loop as directed
			by the particle manager
		*/
 	
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

		/*
			======================== Properties =======================	
			Contains the basic particle manager properties.
		*/
		
		// Keeps track of all the particle systems  that have been initialized and are active
		var particleSystems = [];

		/*
			======================== Public Functions =================
		*/

		/*
			The main update function for the particle manager that is called from the main game loop.
			The particle manager will iterate and allow each individual particle system to update itself	
		*/

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

		/*
			The main draw function for the particle system manager. Iterate through all the managed
			particle systems and allow each one to draw itself using the provided canvas context
		*/

		var draw = function(ctx){
			
			// go through all the particle systems and their draw calls
			for(var i = 0; i < particleSystems.length; i++){
				var particleSystem = particleSystems[i];
				particleSystem.draw(ctx);
			}
		};

		/*
			 Instructs the particle system manager  to create a enemy explosion particle system.
			 The enemy explosion is implemented via a sprite particle system and after creation is added
			 to the particle system managers collection. 
		*/
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
				1,         // the rendering speed
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
			// The main game loop functions
			update:update,
			draw:draw,

			// Particle System creation specific utility function
			enemyExplosion:enemyExplosion
		};

	})();

})(window.game = window.game || {});
