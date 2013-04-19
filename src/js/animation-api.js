/*
	The shim/hack/fix used to provide a stable animation/update loop independent from the processor/browser implementations.

	What this does is tell the browser to call the callback function, which in our case is the game loop,
	when the browser is actually ready to render a frame. The browser is rendering at a default of 60fps.

	If the browser does not support we return the function which uses setTimeout which is not as stable.
*/

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
})();
