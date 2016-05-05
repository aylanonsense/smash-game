//configure requirejs
requirejs.config({
	baseUrl: '/',
	paths: {
		jquery: '/jquery',
		//requirejs plugins for loading different file types
		json: '/require/plugin/json',
		text: '/require/plugin/text'
	}
});

//run /client/main.js
requirejs([ 'main' ], function(main) {
	main();
});