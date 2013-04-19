/*
	The module responsible for drawing and animating the main game canvas background.

	This module is responsible for the starry background. It implements a simple paralax effect by having
	two scrolling transparent backgrounds that move at different speeds.

	The basic implementation is as follows:

		There are two backgrounds beeing drawn

			Two images for each background are drawn one after the other to provide a continious background drawn.
			Once an images moves totally off the bottom it is at once moved at the top providing continious background flow.

		Drawing two backgrounds at different screens and with different images (smaller stars) provides a nice 
		paralax feature
*/

(function(g){
	g.background = (function(){

		/*
			Internal state and configuration properties
			=================================================================
		*/

		var backgroundX = 0;
		
		// front backgrounds
		var backgroundY1 = 0;
		var backgroundY2 = 0;

		// back backgrounds ( parallax )
		var backgroundY3 = 0;
		var backgroundY4 = 0;

		// the background slide speed;
		var slideSpeed = 0.15;

		var slideSpeedParalax = 0.08;

		/*
			Public functions
			=================================================================
		*/

		/*
			The function that sets up the background
			based on canvas dimensions once the canvas elements are loaded
		*/
		
		var setupBackground = function(){
			backgroundY2 = -g.canvas.height;
			backgroundY3 = -g.canvas.height;
		};
		
		/*
			The background animation update call. The update call moves all the images down the screen
			and calculates which image should be moved again at the top.

			The images are moved with different speeds.
		*/

		var update = function(){
			backgroundY1 += slideSpeed * g.dt;
			backgroundY2 += slideSpeed * g.dt;

			backgroundY3 += slideSpeedParalax * g.dt;
			backgroundY4 += slideSpeedParalax * g.dt;

			// Check if any of the images for the simple background needs
			// to be moved to the top

			if(backgroundY1 >= g.canvas.height){
				backgroundY1 = -1 * g.canvas.height;  
			}

			if(backgroundY2 >= g.canvas.height){
				backgroundY2 = -g.canvas.height;  
			}

			// Check the same for the faster moving paralax background images
			
			if(backgroundY3 >= g.canvas.height){
				backgroundY3 = -1 * g.canvas.height;  
			}
			
			if(backgroundY4 >= g.canvas.height){
				backgroundY4 = -g.canvas.height;  
			}
		};

		/*
			Draws all the background images.
		*/
		
		var draw = function(ctx){
			// draw 2 background images for the simple background animation
			g.draw.DrawImage(ctx, g.assets.background, backgroundX, backgroundY1);
			g.draw.DrawImage(ctx, g.assets.background, backgroundX, backgroundY2);

			// draw 2 background images for the background moving at a different speed
			g.draw.DrawImage(ctx, g.assets.backgroundParalax, backgroundX, backgroundY3);
			g.draw.DrawImage(ctx, g.assets.backgroundParalax, backgroundX, backgroundY4);
		};	

		/*
			RMP
			=================================================================
		*/

		return {
			// Initialization
			setupBackground:setupBackground,

			// Game Loop available functions for updating and drawing
			update:update,
			draw:draw
		};
	})();
})(window.game = window.game || {});