const fs = require('fs');


function renderHTML(path, res, status = 200) {
	res.writeHead(status, { 'Content-Type': 'text/html' });
	
	fs.createReadStream(path)
		.on('error', function(err) {
			console.error("ERROR:" + err);
			
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("Could not find or open file for reading \n");
		})
		.pipe(res);
}


module.exports = {
	renderHTML
};

