const http = require('http');
const url = require('url');
const fs = require('fs');


const port = 8080;
const templateDir = __dirname + '/template/';
const server = http.createServer();

server.on('request', function(req, res) {
	const method = req.method;
	const _url = req.url;
	const _baseURL = 'http://' + req.headers.host + '/';
	const myURL = new URL(_url, _baseURL);
	
	if (_url === '/home' || _url === '/') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		fs.createReadStream(templateDir + 'home-table.html')
			.pipe(res);
		
		// res.end('<hl>Hello!</hl>');
	} else if (myURL.pathname === '/test' && myURL.searchParams.get('message')) {
		//http://127.0.0.1:8080/test?message=some%20text
		res.statusCode = 200; // OK
		res.end(myURL.searchParams.get('message'));
	} else if(req.url === '/api/users') {
		const users = [{name: 'John', age: 27}, {name: 'David', age: 37}];
		
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(users));
	} else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		fs.createReadStream(templateDir + '404.html')
			.pipe(res);
	}
});

server.listen(port);

server.on('listening', function() {
	console.log('http://127.0.0.1:' + port);
});