const http = require('http');
const url = require('url');
const fs = require('fs');


const port = 8080;
const templateDir = __dirname + '/template/';
const publicDir = __dirname + '/public/';

const server = http.createServer();

server.on('request', function(req, res) {
	const method = req.method;
	const _url = req.url;
	const _baseURL = 'http://' + req.headers.host + '/';
	const myURL = new URL(_url, _baseURL);
	
	console.log(method, _url)
	
	if (_url === '/home' || _url === '/') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		fs.createReadStream(templateDir + 'home-table.html')
			.on('error', function(err) {
				console.error("ERROR:" + err);

				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end("Could not find or open file for reading \n");
			})
			.pipe(res);
		
		// res.end('<hl>Hello!</hl>');
	} else if (myURL.pathname === '/test' && myURL.searchParams.get('message')) {
		//http://127.0.0.1:8080/test?message=some%20text
		res.statusCode = 200; // OK
		res.end(myURL.searchParams.get('message'));
	} else if(_url === '/api/users') {
		const users = [{name: 'John', age: 27}, {name: 'David', age: 37}];
		
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(users));
	} else if(_url === '/favicon.ico' && method === "GET") {
		const file = publicDir + 'favicon.png';
		
		fs.stat(file, function (err, stat) {
			if (err) {
				console.error(err);
				
				res.writeHead(204, {'Content-Type': 'text/plain'});
				
				res.end();
			} else {
				var img = fs.readFileSync(file); //load image sync!!!
				
				res.contentStatus = 204;
				// res.contentType = 'image/svg+xml';
				res.contentType = 'image/png';
				res.contentLength = stat.size;
				
				res.end(img, 'binary');
			}
		});
	} else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		fs.createReadStream(templateDir + '404.html')
			.on('error', function(err) {
				console.error("ERROR:" + err);
				
				res.end("Could not find or open file for reading \n");
			})
			.pipe(res);
	}
});

server.listen(port);

server.on('listening', function() {
	console.log('http://127.0.0.1:' + port);
});