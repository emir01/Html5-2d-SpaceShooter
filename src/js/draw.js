(function(g){
	g.draw = (function() {
		// ===================== Properties =======================
		// =========================================================

		var TO_RADIANS = Math.PI/180; 

		// ================== Public Functions =====================
		// =========================================================

		// clear a given context
		var clear  = function(ctx){
			ctx.fillStyle = "#5E3F6B";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		};

		// draw a rectangle on the context
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
			
			Draw a rectangle outline
			
		*/

		var rectOutline = function(ctx, x, y, w, h, style){
			ctx.fillStyle = "#FFF";
			ctx.strokeStyle = style;

			ctx.strokeRect(x, y, w, h);
		};

		/*
			Draws a rectangle bounding box
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

		// ================== Private Functions ====================
		// =========================================================

		// draw a rotated image
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

		return {
			Clear:clear,
			Rect: rect,
			DrawImage:drawImage,
			BoundingBox: drawBoundingBox
		};
	})();
})(window.game = window.game || {});