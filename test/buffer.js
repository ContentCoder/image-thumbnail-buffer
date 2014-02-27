var fs = require('fs');
var gm = require('gm');
var tb = require('../thumb-buffer.js');

var imagePath = __dirname + '/sunflower.jpg';
var thumbPath = __dirname + '/thumb.jpg';

var options = {
	height: 200, 
	width: 200, 
	crop: 'Center'
};

tb.create(imagePath, options, function(err, buf, info) {
	if (err) {
		console.log(JSON.stringify(err, null, 2));
		return;
	}

	console.log(JSON.stringify(info, null, 2));
	fs.writeFile(thumbPath, buf, function(err) {
		if (err) {
			console.log(JSON.stringify(e, null, 2));
		} else {
			console.log('done');
		}
	});
});

