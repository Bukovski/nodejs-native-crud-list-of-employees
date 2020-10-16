const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { StringDecoder } = require('string_decoder');

const routes = require('./routes');
const { parseJsonToObject } = require('./helpers');
const { development } = require('./config');


const publicDir = __dirname + '/../public/';


const server = {};

server.httpServer = http.createServer(function (req, res) {
	server.switchHandler(req, res);
});


server.switchHandler = function (req, res) {
	let method = req.method.toLowerCase();
	const _url = req.url;
	const headers = req.headers;
	
	const _baseURL = 'http://' + headers.host + '/';
	const { pathname, search: queryStringObject } = new URL(_url, _baseURL);
	const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');
	
	req.setEncoding("utf8");
	
	
	console.log(method, pathname, queryStringObject)
	
	
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	
	req.on('data', function(data) {
		buffer += decoder.write(data);
	});
	
	req.on('end', function() {
		buffer += decoder.end();
		
		const routeSwitcher = router[ trimmedPath ] ? router[ trimmedPath ] : routes.notFound;
		
		const data = {
			'pathname' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : parseJsonToObject(buffer)
		};
		
		routeSwitcher(data, function(statusCode, payload) {
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object'? payload : {};
			
			const payloadString = JSON.stringify(payload);
			
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			
			console.log("==> response: ", statusCode, payloadString);
		});
		
		/*
		if (routeSwitcher !== undefined) {
			req.data = data;
			
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
			routes[ 'na' ](req, res);
		}
		*/
	})
}


const router = {
	'' : routes.home,
	'home' : routes.home,
	'404' : routes.notFound,
	'api/workers' : routes.workers
};


server.init = function () {
	server.httpServer.listen(development.httpPort);
	
	server.httpServer.on('listening', function () {
		console.log('http://127.0.0.1:' + development.httpPort);
	});
}

module.exports = server;
