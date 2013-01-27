// The simple background handling object
(function(g){
	g.background = (function(){
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

		// The function that sets up the background
		// based on canvas dimensions once the canvas elements are loaded
		var setupBackground = function(){
			backgroundY2 = -g.canvas.height;
			backgroundY3 = -g.canvas.height;
		};
		
		// the background animation update call
		var update = function(){
			backgroundY1 += slideSpeed * g.dt;
			backgroundY2 += slideSpeed * g.dt;

			backgroundY3 += slideSpeedParalax * g.dt;
			backgroundY4 += slideSpeedParalax * g.dt;

			if(backgroundY1 >= g.canvas.height){
				backgroundY1 = -1 * g.canvas.height;  
			}

			if(backgroundY2 >= g.canvas.height){
				backgroundY2 = -g.canvas.height;  
			}

			if(backgroundY3 >= g.canvas.height){
				backgroundY3 = -1 * g.canvas.height;  
			}
			
			if(backgroundY4 >= g.canvas.height){
				backgroundY4 = -g.canvas.height;  
			}
		};

		// the actual background draw call
		var draw = function(ctx){
			// draw 2 background images for the scroll effect
			g.draw.DrawImage(ctx, g.assets.background, backgroundX, backgroundY1);
			g.draw.DrawImage(ctx, g.assets.background, backgroundX, backgroundY2);

			// draw 2 background images for the scroll effect paralaxx
			g.draw.DrawImage(ctx, g.assets.backgroundParalax, backgroundX, backgroundY3);
			g.draw.DrawImage(ctx, g.assets.backgroundParalax, backgroundX, backgroundY4);
		};	

		return {
			setupBackground:setupBackground,
			update:update,
			draw:draw
		};
	})();
})(window.game = window.game || {});