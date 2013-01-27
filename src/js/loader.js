(function(g){

	// setup debug functions to the main game object
	g.loader = (function(){
		// internal asset class for keeping track of assets to be loaded
		var Asset = function(path, data, isAudio){
			this.path = path;
			this.data = data;
			this.isAudio = isAudio;
		};

		// an array of assets to load
		var assetsToLoad = [];

		// keep track of number of assets to load.
		var assetCount = 0;

		// ====================== Public Functions ===================
		// load a given asset
		// currently only handles image loading
		var addAsset = function(path, isAudio){
			if(isAudio){
				return addAudioAsset(path)
			}
			else{
				return addImageAsset(path);
			}
		};

		// Initialize the download of all added assets up to the call point
		// params : 
		//			-singleLoadCallback: callback for single asset load
		//			-allLoadCallback: callback when we have loaded all assets.
		var downloadAllAssets = function(allLoadCallback, singleLoadCallback ){

			// if there are no setup assets to load
			if(assetCount == 0){
				// just call the allLoadCallback
				if(typeof allLoadCallback !== "undefined"){
					allLoadCallback();	
				}

				// and then just return
				return;
			}

			// go through all the assets in the load array
			for(var i = 0; i < assetsToLoad.length; i++){
				var asset = assetsToLoad[i];
				
				// use a closure the wrap the asset load initialization
				(function(asset){
					if(asset.isAudio){
						loadAudioAsset(asset, allLoadCallback, singleLoadCallback);
					}
					else{
						loadImageAsset(asset, allLoadCallback, singleLoadCallback);
					}
					
				})(asset);
			}
		};

		// ====================== Private Functions ===================

		// start loading a given image asset
		var loadImageAsset = function(asset, allLoadCallback, singleLoadCallback){
			//setup our internal callback on the load event
			asset.data.addEventListener("load", function() {
				assetLoadedInternalCallback(allLoadCallback, singleLoadCallback);
			}, false);

			// set the src to start loading
			asset.data.src = asset.path
		};

		// start loading a given audio asset
		var loadAudioAsset = function(asset, allLoadCallback, singleLoadCallback){
			var audio = asset.data;

			// check if its already loaded.
			if(audio.getStateCode() == " HAVE_ENOUGH_DATA"){
				assetLoadedInternalCallback(allLoadCallback, singleLoadCallback);
			}

			// else bind to the canplaythrough event
			audio.bind("canplaythrough",function(){
				assetLoadedInternalCallback(allLoadCallback, singleLoadCallback);
			});
		};

		// adds an image asset to be loaded when downloadAllAssets is Called
		var addImageAsset = function(path) {
			var image = new Image();

			// create a new asset with the path and image
			var asset = new Asset(path, image, false);

			// push the asset object ot the load array
			assetsToLoad.push(asset);
			assetCount++;

			// return the image to the calling code
			return image;
		};

		// adds an audio asset to be loaded when downloadAllAssets is Called
		var addAudioAsset = function(path){
			//set the path based on the audio support
			if(buzz.isMP3Supported()){
				path = path + ".mp3";
			}
			else{
				path = path + ".wav";	
			}

			// create and return a buzz sound
			var sound = new buzz.sound(path, {
				preload: false
			});

			// create a new asset with the path and image
			var asset = new Asset(path, sound, true);

			// push the asset object ot the load array
			assetsToLoad.push(asset);
			assetCount++;

			return sound;
		};

		// The loaders internal asset loaded callback that will notify the caller of download 
		// all of the asset loads
		var assetLoadedInternalCallback = function(allLoadCallback, singleLoadCallback ){
			// reduce the number of assets to load
			assetCount--;
			
			// if we loaded everything
			if(assetCount == 0){
				// and the all load callback is defined we are going to call it
				if(typeof allLoadCallback !== "undefined"){
					allLoadCallback();	
				}
			}

			//  if it is defined call the singe load callback
			if(typeof singleLoadCallback !== "undefined"){
				// call the single load in either case
				singleLoadCallback();
			}
		};

		// ====================== RMP ===================
		return{
			AddAsset:addAsset,
			LoadAll:downloadAllAssets
		};

	})();

})(window.game = window.game || {});