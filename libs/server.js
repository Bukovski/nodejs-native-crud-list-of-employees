const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { StringDecoder } = require('string_decoder');

const { routes } = require('./routes');
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
	let { pathname, search: queryStringObject } = new URL(_url, _baseURL);
	
	req.setEncoding("utf8");
	
	try {
		pathname = decodeURIComponent(pathname); //we encode Russian letters and unclear symbols
	} catch(e) {
		method = 'na'
	}
	
	if (~pathname.indexOf('\0')) { //zero byte in string
		method = 'na'
	}
	
	console.log(method, pathname, queryStringObject)
	
	const routeSwitcher = routes[ pathname ];
	
	
	
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	
	req.on('data', function(data) {
		buffer += decoder.write(data);
	});
	
	req.on('end', function() {
		buffer += decoder.end();
		
		
		const data = {
			'pathname' : pathname,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : parseJsonToObject(buffer)
		};
		
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
	})
}

server.init = function () {
	server.httpServer.listen(development.httpPort);
	
	server.httpServer.on('listening', function () {
		console.log('http://127.0.0.1:' + development.httpPort);
	});
}

module.exports = server;
