/*
	The draw module is responsible for abstracting canvas specific draw calls.

	It is heavily used to hide way the drawing of the images for the major entities in the game
	among which are the palyer, doodads and enemy ships.

	Draw is probably the first written functionality besides initialization/testing/main game code
	as it was initially used to test canvas interaction
*/

(function(g){
	g.draw = (function() {
		/*
			 ===================== Properties =======================
		*/
		
		/*
			Pi value in radians? Used in rotation calculations
		*/

		var TO_RADIANS = Math.PI/180; 

		/*
			================== Public Functions =====================
		*/ 
		
		/*
			Clear the context with the specific fill style
		*/

		var clear  = function(ctx){
			ctx.fillStyle = "#5E3F6B";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		};

		/*
			Draws a simple rectangle at the given x and y coordinates with the given
			width and height properties.

			The fill style is fixed, meaning probably its not used from outside code
			and was a initall test draw function for the canva.
		*/

		var rect = function(ctx, x, y, w, h){
			ctx.fillStyle = "#FFF";
			
			ctx.fillRect(x, y, w, h);
		};
		
		// the simplest image function that draws the given
		// image at the given location
		var drawImage = function(ctx, img, x, y, rotation){
			if(typeof rotation === "undefined"){
				rotation = 0;
			}
			
			// if there is no rotation draw a simple regular image
			if(rotation == 0){
				ctx.drawImage(img, x, y);	
			}
			else{
				drawRotatedImage(ctx, img, x, y, rotation);
			}
		};

		/*
			Draw a rectangle outline at the given x and y coordinates
			with the given width and height properties as well as a specific
			stroke style.
		*/

		var rectOutline = function(ctx, x, y, w, h, style){
			ctx.fillStyle = "#FFF";
			ctx.strokeStyle = style;

			ctx.strokeRect(x, y, w, h);
		};

		/*
			Draws a rectangle bounding box. Servers as a preprocessor for the 
			rectOutline.

			As a parameter it takes the context to which the bounding box will be drawn
			and the actual bounding box object defined and returned by the entities
			that have used bounding boxes:

			Player,
			Enemies,
			Projectiles
		*/

		var  drawBoundingBox = function(ctx, boundingBox){

			if(boundingBox === null){
				return;
			}

			// its a single bounding box
			if(typeof boundingBox === 'object'){
				rectOutline(ctx, boundingBox.x, boundingBox.y, boundingBox.w, boundingBox.h,"F00");
			}

			// it probably is an array of bounding boxes so draw all of them
			if(typeof boundingBox.length != undefined){
				for (var i = boundingBox.length - 1; i >= 0; i--) {
					var bb = boundingBox[i];
					rectOutline(ctx, bb.x, bb.y, bb.w, bb.h,"F00");
				};
			}

			return;
		};

		/*	
			================== Private Functions ====================

			What follows are private utility functions used to implement some of the public features.
		*/
		
		/*
			Draws an image on the canvas included with a given rotation angle, usefull when drawing the same sprite
			at different rotations to give variety to assets.

			Notably used when drawing the asteroid doodads. The same asteroid image is varied by drawing it 
			at different rotation angles.
		*/

		function drawRotatedImage(context, image, x, y, angle) { 
		 
			// save the current co-ordinate system 
			// before we screw with it
			context.save(); 
		 
			// move to the middle of where we want to draw our image
			context.translate(x, y);
		 
			// rotate around that point, converting our 
			// angle from degrees to radians 
			context.rotate(angle * TO_RADIANS);
		 
			// draw it up and to the left by half the width
			// and height of the image 
			context.drawImage(image, -(image.width/2), -(image.height/2));
		 
			// and restore the co-ords to how they were when we began
			context.restore(); 
		}

		/*	
			Revealing module pattern.
		*/	

		return {

			// Basic functions
			Clear:clear,

			// Basic drawing functions
			Rect: rect,
			DrawImage:drawImage,

			// Utility drawing functions
			BoundingBox: drawBoundingBox
		};
	})();
})(window.game = window.game || {});