var fs = require('fs-extra');

fs.copy(
    'dist/index.html',
    'dist/200.html',
    function(err) {
	if (err) return console.error(err);

	console.log("Copied `dist/index.html` into `dist/200.html`");
    }
);
	    
