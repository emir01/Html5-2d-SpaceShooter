/*
	Loaded is the main asset loading module that handles the loading and managing of game assets:

	Sprites,
	Images,
	Audio

	It is to be used on initial game load to load all the required images from the server. It implements a callback system
	for loading resources, notifying the calling/client code when an individual resource or all specified resources are loaded.
*/

(function(g){
	g.loader = (function(){
		
		/*
			Internal asset construction function used for internally keeping track of assets.

			Used to define which assets to load on initial game startup.
		*/

		var Asset = function(path, data, isAudio){
			// Where can the asset be found. Usually server path
			this.path = path;

			// The raw asset data
			this.data = data;

			// Is the asset audio. Used to determine the way to load the assets ( Audio Libraries )
			// Should probably refactor to a more generic asset type variable with audio as possible option
			this.isAudio = isAudio;
		};

		/*
			The internal array containing all the assets to be loaded
		*/

		var assetsToLoad = [];

		/*
			Internal variable keeping track of the number of assets to load. 

			NOTE: Probably needs refactoring of sorts, as it is probably the same as assetsToLoad.lengt
		*/	
		
		var assetCount = 0;

		/*
			====================== Public Functions ===================


		*/	
		
		/*
			The function will add an asset to the collection of assets to be loaded. 

			The calling code must specify if we are refering to audio assets, which are loaded in a specific
			way that is different from image/sprite assets.
		
			The function returns a reference to the asset. The reference can be:

			Image object for image assets
			Buzz Sound for audio assets (Buzz is a HTML5 audio library)
		*/
		
		var addAsset = function(path, isAudio){
			if(isAudio){
				return addAudioAsset(path)
			}
			else{
				return addImageAsset(path);
			}
		};

		/*
			Initialize the download of all added assets that are tracked by the loader
			
			params : 
					-singleLoadCallback: callback for single asset load
					-allLoadCallback: callback when we have loaded all assets.
		*/	
		
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

				// !!!!Use a closure the wrap the asset load initialization!!!!!
				// At the point of going over the documentation/comments not sure why this is used.
				// Maybe next time it would be a good idea to actually comment why something is done instead of point out the
				// obvious as the first !!!! wrapped comment :(
				(function(asset){

					// Ass audio assets are loaded using Buzz, we must check what we are loading
					if(asset.isAudio){
						loadAudioAsset(asset, allLoadCallback, singleLoadCallback);
					}
					else{
						loadImageAsset(asset, allLoadCallback, singleLoadCallback);
					}
				})(asset);
			}
		};

		/*
			=================================== Private Functions =============================
		*/

		/*
			Starts the load process for a given image asset. Actually just sets the src on the internal Aseet object data property, 
			which for image assets is set to an Image object:

			asset.data = new Image();

			Setting src will try and get the image from the path. 

			We alo set an event listener that will determine when the image was loaded. Upon load we call an internal asset loaded callback,
			which is explained in its own section
		*/
		
		var loadImageAsset = function(asset, allLoadCallback, singleLoadCallback){
			//setup our internal callback on the load event
			asset.data.addEventListener("load", function() {
				assetLoadedInternalCallback(allLoadCallback, singleLoadCallback);
			}, false);

			// set the src to start loading
			asset.data.src = asset.path
		};

		/*
			Start loading an audio asset using Buzz specific calls. Buzz works differently as audio is probably 
			loaded once the buzz audio object is created.

			The audio asset load only checks if its loaded, or eventually sets a callback that will
			call the internal asset loaded function.
		*/

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

		/*
			Internal function that adds an image asset to be loaded when the loader is instructed
			to load all assets.

			Creates the internal Asset object setting apropriate data and path properties as well as the isAudio flag
		*/

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

		/*
			Internal function that adds an audio asset to be loaded when the loader is instructed
			to load all assets.

			Relies on the Buzz HTML5 audio library. It is currently not quite optimzed as .wav files are used, which 
			are quite big.

			NOTE: Refactor and probably Optimze!!!
		*/

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

		/*
			The internal asset loaded callback which is called each time a single asset is laoded, after the call to
			Loader.LoadAll is made.

			Reduce the asset count and call the appropriate client code functions if they have been defined.
		*/
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
			// Asset preparation for download
			AddAsset:addAsset,

			// Asset download initialization
			LoadAll:downloadAllAssets
		};
	})();
})(window.game = window.game || {});