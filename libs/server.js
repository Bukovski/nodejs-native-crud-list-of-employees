const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { StringDecoder } = require('string_decoder');

const routes = require('./routes');
const { parseJsonToObject } = require('./helpers');
const { development } = require('./config');




const server = {};

server.httpServer = http.createServer(function (req, res) {
	server.switchHandler(req, res);
});


server.switchHandler = function (req, res) {
	req.setEncoding("utf8");
	
	let method = req.method.toLowerCase();
	const _url = req.url;
	const headers = req.headers;
	
	const _baseURL = 'http://' + headers.host + '/';
	const { pathname, search: queryStringObject } = new URL(_url, _baseURL);
	const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');
	
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	
	req.on('data', function(data) {
		buffer += decoder.write(data);
	});
	
	req.on('end', function() {
		buffer += decoder.end();
		
		let routeSwitcher = router[ trimmedPath ] ? router[ trimmedPath ] : routes.notFound;
		routeSwitcher = trimmedPath.includes('public/') ? router.public : routeSwitcher;
		
		const data = {
			'pathname' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : parseJsonToObject(buffer)
		};
		
		routeSwitcher(data, function(statusCode, payload, contentType) {
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			contentType = typeof(contentType) == 'string' ? contentType : 'json';
			
			
			let payloadString = '';
			
			if (contentType === 'json') {
				res.setHeader('Content-Type', 'application/json');
				
				payload = typeof(payload) == 'object'? payload : {};
				payloadString = JSON.stringify(payload);
			}
			
			if (contentType === 'html') {
				res.setHeader('Content-Type', 'text/html');
				payloadString = typeof(payload) == 'string'? payload : '';
			}
			
			/*******************************************************/
			
			if (contentType === 'favicon') {
				res.setHeader('Content-Type', 'image/x-icon');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			
			if (contentType === 'plain') {
				res.setHeader('Content-Type', 'text/plain');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			
			if (contentType === 'css') {
				res.setHeader('Content-Type', 'text/css');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			
			if (contentType === 'png') {
				res.setHeader('Content-Type', 'image/png');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			
			if ([ 'jpg', 'jpeg' ].includes(contentType)) {
				res.setHeader('Content-Type', 'image/jpeg');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			
			res.writeHead(statusCode);
			res.end(payloadString);
			
			if(statusCode === 200){
				console.log('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
			} else {
				console.log('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
			}
		});
	})
}


const router = {
	'' : routes.home,
	'home' : routes.home,
	'404' : routes.notFound,
	'api/workers' : routes.workers,
	'public' : routes.public,
	'favicon.ico' : routes.favicon,
};


server.init = function () {
	server.httpServer.listen(development.httpPort);
	
	server.httpServer.on('listening', function () {
		console.log('http://127.0.0.1:' + development.httpPort);
	});
}

module.exports = server;
