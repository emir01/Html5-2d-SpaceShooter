// Setup the main game elements and game loop
(function(g){

	// start when the dom is loaded
	$(function(){

		g.canvas = document.getElementById('main-canvas');
		g.ctx = g.canvas.getContext('2d');

		// load the assets required in the game
		g.assets = {};
		var a = g.assets;

		// ======================== Load Assets ===================
		//=========================================================
		
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

		a.background = g.loader.AddAsset("assets/Background/background-full.png");
		a.backgroundParalax = g.loader.AddAsset("assets/Background/background-full-back.png");

		// -------------------------------------- Audio
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

		// once everything is loaded we are going to start calling the game loop
		g.loader.LoadAll(startGame);
	});

	// ======================== Main Functions =======================
	//================================================================

	// the start game function that will initialize initial game state
	// and start the game loop
	function startGame(){
		// remove the "loading screen"
		$("#main-loading").hide();

		// start the background music
		//g.assets.backgroundMusic.loop().play().fadeIn();

		g.background.setupBackground();

		// start by the initial state
		g.state.setState();

		// init the enemy spawner
		g.spawner.start();

		// init the doodad spawner
		g.doodadspawner.start();

		// setup delta time
		g.last = new Date().getTime(),
		g.dt = 0;

		// start the game loop
		gameLoop();
	};

	// The main Game Loop
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

		// Make the update call
		updateCall();

		// make the draw call
		drawCall();
	};

	// the update call
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

	// the main draw call
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