//configure requirejs
requirejs.config({
	baseUrl: BASE_URL,
	paths: {
		//requirejs plugins for loading different file types
		json: 'require/plugin/json',
		text: 'require/plugin/text'
	}
});

//run /client/main.js
requirejs([ 'main' ], function(main) {
	main();
});