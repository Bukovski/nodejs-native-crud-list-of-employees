const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL, URLSearchParams } = require('url');



const port = 8080;
const templateDir = __dirname + '/template/';
const publicDir = __dirname + '/public/';

const server = http.createServer(router);

function router(req, res) {
	const reqMethod = req.method;
	const _url = req.url;
	
	const _baseURL = 'http://' + req.headers.host + '/';
	const { pathname, query } = new URL(_url, _baseURL);
	
	const routeSwitcher = routes[ reqMethod ][ pathname ];
	
	
	console.log(reqMethod, _url, routeSwitcher)
	
	
	if (routeSwitcher !== undefined) {
		req.queryParams = query;
		routeSwitcher(req, res);
	} else if (req.url.match(/.css$/)) {
		const cssPath = path.join(publicDir, req.url);
		const fileStream = fs.createReadStream(cssPath, 'UTF-8');
		
		fileStream.on('error', function(err) {
			console.error("ERROR:" + err);
			res.end();
		})
		
		res.writeHead(200, {"Content-Type" : "text/css"});
		
		fileStream.pipe(res);
	} else {
		routes[ 'NA' ](req, res);
	}
}

const routes = {
	'GET': {
		'/': (req, res) => {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			fs.createReadStream(templateDir + 'home-table.html')
				.on('error', function(err) {
					console.error("ERROR:" + err);
					
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end("Could not find or open file for reading \n");
				})
				.pipe(res);
		},
		'/home': (req, res) => {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			fs.createReadStream(templateDir + 'home-table.html')
				.on('error', function(err) {
					console.error("ERROR:" + err);
					
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end("Could not find or open file for reading \n");
				})
				.pipe(res);
		},
		'/test': (req, res) => {
			const paramsUrl = new URLSearchParams(req.url);
			
			if (paramsUrl.get("/test?message")) {
				//http://127.0.0.1:8080/test?message=some%20text
				res.statusCode = 200; // OK
				res.end(paramsUrl.get("/test?message"));
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
		res.writeHead(404, {'Content-Type': 'text/html'});
		fs.createReadStream(templateDir + '404.html')
			.on('error', function(err) {
				console.error("ERROR:" + err);
				
				res.end("Could not find or open file for reading \n");
			})
			.pipe(res);
	}
}

server.listen(port);

server.on('listening', function() {
	console.log('http://127.0.0.1:' + port);
});