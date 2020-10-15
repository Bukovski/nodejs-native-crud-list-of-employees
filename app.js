const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { routes } = require('./routes');


const publicDir = __dirname + '/public/';


function router(req, res) {
	let reqMethod = req.method;
	const _url = req.url;
	
	const _baseURL = 'http://' + req.headers.host + '/';
	let { pathname, search } = new URL(_url, _baseURL);
	
	req.setEncoding("utf8");
	
	try {
		pathname = decodeURIComponent(pathname); //we encode Russian letters and unclear symbols
	} catch(e) {
		reqMethod = 'NA'
	}
	
	if (~pathname.indexOf('\0')) { //zero byte in string
		reqMethod = 'NA'
	}
	
	const routeSwitcher = routes[ reqMethod ][ pathname ];

	console.log(reqMethod, pathname)
	
	if (routeSwitcher !== undefined) {
		req.queryParams = search;
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

module.exports = {
	router
};
