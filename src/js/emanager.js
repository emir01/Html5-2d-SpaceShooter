/*	
	An entity manager script that handles
	update and draw calls for multiple entities which are not controlled by the player.

	Contains an internal array of entities, where for each one  it calls update and draw methods, allowing
	them to update and draw themselfs on the provided canvas elements.

	As it manages all the non-player entities it is also responsible for calculating collisions between 
	apropriate entities
*/

(function(g){
	var emanager = (function(){

		// =========== Objects used by the entitiy manager ========
		// =========================================================
 
		// An inner entity object used by the enitit manager
		// to more easiliy handle some entitiy related operations
		var managedEntitiy = function(entity, removeOnBounds) {
			// the actual entity that will be drawn/updated
			this.entity = entity;

			// flag telling us if this current entity should 
			// be check and removed for bound violations
			this.removeOnBounds = removeOnBounds;
		};
		
		// ======================== Properties ====================
		// =========================================================

		// the collection of entities  will be updated
		// the entities must have an update and draw call
		var entities = [];

		// ======================== Public Functions ==============
		// =========================================================

		// used to clear/restart the game clearing up all the entities
		var reset = function(){
			for (var i = entities.length - 1; i >= 0; i--) {
				var entitiy = entities[i];
				delete entitiy;
			};

			entities = [];
		};

		// Iterate and draw all the entities managed by the 
		// entity manager 
		var drawEntities = function(ctx){
			// loop and call the entitiy draw function
			for(var i = 0; i< entities.length; i++){
				var entWrapper = entities[i];
				entWrapper.entity.draw(ctx);
			}
		};

		// add the given entitiy to the control of the entiity manager
		// The Remove on bounds flag is default set to true
		var addEntity = function(entity, removeOnBounds){
			// we will create an inner managed entitiy
			// that will store the entity and the required
			var mEntitiy = new managedEntitiy(entity, removeOnBounds || true)

			// push the entitity to the array
			entities.push(mEntitiy);
		};

		// Iterate and update all the entities managed by the 
		// entitiy manager
		var updateEntities = function(){
			for(var i = 0; i < entities.length; i++){
				var entWrapper = entities[i];

				// check if the entitiy should be removed if out of bounds 
				// and if it is currently out of bounds
				if(entWrapper.removeOnBounds && entWrapper.entity.isOffScreen()){
					entities.splice(i,1);
					delete entWrapper;
				}
				else{
					// call the update on the entitiy 
					entWrapper.entity.update();

					checkCollisions(entWrapper, i);
				}
			}
		};

		// ======================== Private Functions ================
		// ===========================================================

		// check collisions for the entitiy given with the entity wrapper 
		// and its index in the emanager entitiy collection
		var checkCollisions = function(entWrapper, entitiyIndex){

			// If the entitiy was updated check its collisions with related entities
			// At this point do not check if the projectiles belong to an enemy
			if(entWrapper.entity.type == "projectile"){

				// If the projetile does not belong to the enemy, then it belongs to the player
				// so we are going to check for projectile-enemy collisions
				if(!entWrapper.entity.isEnemy){
					// check for enemy collisions for the projectile
					var collisionIndex = checkProjectileEnemyCollisions(entWrapper.entity)

					if(collisionIndex !== -1){
						var colidedEnemy = entities[collisionIndex];

						removeCollidedEntities(collisionIndex, entitiyIndex);
						playExplosionAudio();

						// ask the particle manager to render an enemy
						// explosion at the collision cords
						g.particle.enemyExplosion(
											colidedEnemy.entity.x, 
											colidedEnemy.entity.y,
											colidedEnemy.entity.image.width,
											colidedEnemy.entity.image.height
											);

						// delete both the colided objects from memory
						delete colidedEnemy;
						delete entWrapper;

						// Update the state
						g.state.enemyDestroyed();

						// Do not continue with checks
						return;
					}
				}
				else{
					// The projectile was fired by the  enemy.
					var enemyProjectileHitPlayer = checkCollisionWithPlayer(entWrapper.entity);

					var enemyProjectile = entWrapper.entity;

					if(enemyProjectileHitPlayer){
						g.dbg.log("Enemy projectile hit player");

						// remove the enemy projectile from the tracked entities
						entities.splice(entitiyIndex, 1);

						// Explode the player by using the enemy explision particle
						// function

						g.particle.enemyExplosion(
										g.player.getX(), 
										g.player.getY(),
										g.player.getW(),
										g.player.getH()
						);

						g.player.playerHit();

						delete entWrapper.entity;

						// Do not continue with checks
						return;
					}
				}
			}

			// if the entitiy was updated and its an enemy check if it collides with the player
			if(entWrapper.entity.type == "enemy"){
				var enemyPlayerCollision =  checkCollisionWithPlayer(entWrapper.entity)

				if(enemyPlayerCollision){

					var colidedWithPlayerEnemy = entWrapper.entity;

					// if the enemy collides with the enemy remove 
					// the enemy and do the explosion
					entities.splice(entitiyIndex, 1);


					// ask the particle manager to render an enemy
					// explosion at the collision cords
					g.particle.enemyExplosion(
										entWrapper.entity.x, 
										entWrapper.entity.y,
										entWrapper.entity.image.width,
										entWrapper.entity.image.height
										);

					var ppbb = g.player.getBoundingBox();

					g.player.playerHit();

					delete entWrapper.entity;

					// Do not continue with checks
					return;
				}
			}
		};

		var removeCollidedEntities = function(firstEntitiyIndex, secondEntitiyIndex){
			// check the splicing order so we remove both the entities
			// by removing the bigger index first
			if(firstEntitiyIndex > secondEntitiyIndex){
				entities.splice(firstEntitiyIndex,1);
				entities.splice(secondEntitiyIndex,1);
			}
			else{
				entities.splice(secondEntitiyIndex,1);
				entities.splice(firstEntitiyIndex,1);
			}
		};

		// Work around the issues with the explosion sounds
		// TODO: Refactor out to a sound manager
		var playExplosionAudio = function(){
			if(g.config.soundEnabled){
				if(g.assets.soundExplosion1.isEnded() || g.assets.soundExplosion1.isPaused()){
					g.assets.soundExplosion1.play();	
				}
				else if(g.assets.soundExplosion2.isEnded() || g.assets.soundExplosion2.isPaused()){
					g.assets.soundExplosion2.play()
				}
				else if(g.assets.soundExplosion3.isEnded() || g.assets.soundExplosion3.isPaused()){
					g.assets.soundExplosion3.play()
				}
			}
		};

		/*	
			For a given projectile checks if it collides with ay enemy.
			If there is an enemy collision we return the enemy index so we can remove both entities.
			If there is no collision we return a negative index
		*/

		var checkProjectileEnemyCollisions = function(projectileEntity){
			var colidedIndex = -1;

			for(var k=0; k< entities.length; k++){
				var ent = entities[k].entity;

				// if the entitiy we are checking is an enemy
				if(ent.type == "enemy"){
					// if the enemy we are checking collides with the projectile
					if(isIntersect(ent.getBoundingBox(), projectileEntity.getBoundingBox())){
						// return true for a collision
						colidedIndex = k;
						break;
					}
				}
			}

			return colidedIndex;
		};

		/*
			Check if an enemy entitiy collides with the player entitiy.

			The enemy entities can be either:
				Enemy ships
				Enemy projectiles
		*/

		var checkCollisionWithPlayer = function(enemyEntitiy){

			// if the player cant be hit just return false
			if(!g.player.playerIsHittable()){
				return false;
			}

			var playerbb =	 g.player.getBoundingBox();
			var enemybb = enemyEntitiy.getBoundingBox();

			var theyIntersect = false;

			for (var i = playerbb.length - 1; i >= 0; i--) {
				var onebb = playerbb[i];

				if(isIntersect(onebb, enemybb)){
					theyIntersect = true;
					break;
				}
			};

			return theyIntersect;
		};

		// check if two bounding boxes intersect meaning there is a BoundingBox collision between them
		var isIntersect = function(bb1, bb2){
			// transform the bounding boxes to a presentation
			// usable by the copy/paste check
			var r1 = {
				left:   bb1.x,
  				top:    bb1.y,
  				right:  bb1.x + bb1.w,
  				bottom: bb1.y + bb1.h
			};

			var r2 = {
				left:   bb2.x,
  				top:    bb2.y,
  				right:  bb2.x + bb2.w,
  				bottom: bb2.y + bb2.h
			};

			return !(r2.left > r1.right || 
			         r2.right < r1.left || 
           			 r2.top > r1.bottom ||
           			 r2.bottom < r1.top);
		};

		// ========================== RMP =========================
		// =========================================================

		return {

			// Public functions
			reset:reset,

			// Construction functions.
			addEntity:addEntity,

			// Main game loop functions
			updateEntities:updateEntities,
			drawEntities:drawEntities
			
		};
	})();

	// Namespace the entitiy manager
	g.emanager = emanager;

})(window.game = window.game || {});