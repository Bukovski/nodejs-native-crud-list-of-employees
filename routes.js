const fs = require('fs');
const { URLSearchParams } = require('url');
const { renderHTML } = require('./requestHandlers');

const templateDir = __dirname + '/template/';
const publicDir = __dirname + '/public/';


const routes = {
	'GET': {
		'/': (req, res) => {
			renderHTML(templateDir + 'home-table.html', res);
		},
		'/home': (req, res) => {
			renderHTML(templateDir + 'home-table.html', res);
		},
		'/test': (req, res) => {
			const paramsUrl = new URLSearchParams(req.queryParams);
			
			if (paramsUrl.get("message")) {
				//http://127.0.0.1:8080/test?message=some%20text
				res.statusCode = 200; // OK
				res.end(paramsUrl.get("message"));
			} else {
				res.statusCode = 400;
				res.end("Bad Request");
			}
		},
		'/favicon.ico': (req, res) => {
			const file = publicDir + 'favicon.png';
			
			fs.stat(file, function (err, stat) {
				if (err) {
					console.error(err);
					
					res.writeHead(204, {'Content-Type': 'text/plain'});
					
					res.end();
				} else {
					var img = fs.readFileSync(file); //load image sync!!!
					
					res.contentStatus = 204;
					res.contentType = 'image/png';
					res.contentLength = stat.size;
					
					res.end(img, 'binary');
				}
			});
		},
	},
	'POST': {
		'/api/users': (req, res) => {
			const users = [{name: 'John', age: 27}, {name: 'David', age: 37}];
			
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(users));
		},
	},
	'NA': (req, res) => {
		renderHTML(templateDir + '404.html', res, 404);
	}
}

module.exports = {
	routes
};
