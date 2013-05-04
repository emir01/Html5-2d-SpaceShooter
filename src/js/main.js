/*
	The main game initialization script. Loaded and initialized after all the other game scripts and entities have been loaded
	and initialized.

	Sets up initial canvas properties for the game namespace.

	Loads all the resources for the game using the g.loader ( The asset loader )

	Sets up the game loop using the animation-api.
*/

(function(g){
	/*
		Starts initialization when the dom is loaded
	*/

	$(function(){

		// Get the canvas
		g.canvas = document.getElementById('main-canvas');
		g.ctx = g.canvas.getContext('2d');

		// Setup the assets namespace and start loading assets
		g.assets = {};
		var a = g.assets;
				
		// ### Loading image assets
		a.player = g.loader.AddAsset("assets/player.png");
		a.playerRight = g.loader.AddAsset("assets/playerRight.png");
		a.playerLeft = g.loader.AddAsset("assets/playerLeft.png"); 
		a.playerDamaged = g.loader.AddAsset("assets/playerDamaged.png");

		a.meteorSmall = g.loader.AddAsset("assets/meteorSmall.png");
		a.meteorBig = g.loader.AddAsset("assets/meteorBig.png");
		a.speedLine = g.loader.AddAsset("assets/Background/speedLine.png");

		a.enemy = g.loader.AddAsset("assets/enemyShip.png");

		a.explosion = g.loader.AddAsset("assets/explosion.png");

		a.laserGreen = g.loader.AddAsset("assets/laserGreen.png");
		a.laserRed = g.loader.AddAsset("assets/laserRed.png");

		a.background = g.loader.AddAsset("assets/Background/background-full.png");
		a.backgroundParalax = g.loader.AddAsset("assets/Background/background-full-back.png");

		// ### Loading audio assets
		// audio is loaded withouth extension as the loader will handle
		// what will get retrieved based on the browser format support
		a.soundLaser1 = g.loader.AddAsset("assets/Audio/Laser2", true);
		a.soundLaser2 = g.loader.AddAsset("assets/Audio/Laser2", true);
		a.soundLaser3 = g.loader.AddAsset("assets/Audio/Laser2", true);
		a.soundLaser4 = g.loader.AddAsset("assets/Audio/Laser2", true);
		
		a.soundExplosion1 = g.loader.AddAsset("assets/Audio/Explosion1", true);
		a.soundExplosion2 = g.loader.AddAsset("assets/Audio/Explosion1", true);
		a.soundExplosion3 = g.loader.AddAsset("assets/Audio/Explosion1", true);

		a.backgroundMusic = g.loader.AddAsset("assets/Audio/background", true);
		
		// Start the asset loading process
		// once everything is loaded we are going to start calling the game loop
		g.loader.LoadAll(startGame);
	});

	/*
		Main Functions
		===========================================================================
	*/
	
	/*
		Called once all the assets are loaded. Hides the asset loading overlay and starts the initialization of 
		major game modules.
	*/

	function startGame(){
		// Remove the "loading screen"
		$("#main-loading").hide();

		// Initialize dom ui
		g.domui.initDomUI(resetGame);

		// Start the background music
		// g.assets.backgroundMusic.loop().play().fadeIn();

		// Initialize the 
		g.background.setupBackground();

		// Fully reset the game state
		resetGame();

		// Init the enemy spawner
		g.spawner.start();

		// Init the doodad spawner
		g.doodadspawner.start();

		// Setup the delta time functionality which is covered in the main game loop
		g.last = new Date().getTime(),
		g.dt = 0;

		// Start the game loop
		gameLoop();
	};

	/*
		Resets the entire game state and initializations for some of the modules.
		This function sets the game to an initial starting state.
	*/

	function resetGame (){
		// reset state
		g.state.setInitialState();

		// Clears any dom overlays
		g.domui.clearOverlays();

		// show the lives remaining
		g.domui.showPlayerLives(g.state.getPlayerLives());

		// make player changes
		g.player.reset();
		g.player.setPlayerHittable(false);

		// make emanage changes
		g.emanager.reset();

		setTimeout(function(){
			g.player.setPlayerHittable(true);		
			g.domui.hidePlayerLives();	
		},g.state.playerInvuTime);

	};

	/*
		The main game loop which relies on the requestAnimFrame call to setup the next call of the game loop.

		We also calcualte the time from the last call to gameLoop. This value expressed in milliseconds called delta time (dt)
		is used to implement smoother animations by moving/translating entities in a constant rate.

		The main game loop function calls the update and draw calls.
	*/

	function gameLoop(){

		requestAnimFrame(gameLoop);

		// update delta time
		var now = new Date().getTime();
		g.dt = now - g.last;
		g.last = now;

		if(g.dt > 1000){
			g.dt = 1;
		}

		// clear the screen
		g.draw.Clear(g.ctx);

		// if the game is not over
		if(!g.state.isGameOver()){
			// Make the update call
			updateCall();

			// make the draw call
			drawCall();
		}
		else{
			if(g.state.getState() != g.state.gameStates.GameOverDisplayed){
				g.domui.showGameOverOverlay(g.state.getPlayerScore(), g.state.getCurrentWave(),g.state.getTimeElapsed());
				g.state.setState(g.state.gameStates.GameOverDisplayed);
			}
		}
	};

	/*
		The main update call. Calls the update methods on all the dependent and major modules of the game.
	*/

	function updateCall(){
		// call the background module update
		g.background.update();

		// update the enemy spawner
		g.spawner.update();

		// update the doodad spawner
		g.doodadspawner.update();

		// call the players update
		g.player.update();

		// call the update on the entitiy manager
		g.emanager.updateEntities();

		// update the particle system
		g.particle.update();

		g.state.update();
	};

	/*
		The main draw call. Calls the draw methods on all the dependend and major modules of the game.
	*/

	function drawCall() {
		// draw the background
		g.background.draw(g.ctx);

		// call the draw entities on the manager
		g.emanager.drawEntities(g.ctx);

		g.particle.draw(g.ctx);

		// draw the player
		g.player.draw(g.ctx);

		// draw the player
		g.state.draw(g.ctx);
	};
})(window.game = window.game || {});