const fs = require('fs');
const { URLSearchParams } = require('url');
const { renderHTML } = require('./requestHandlers');

const templateDir = __dirname + '/../template/';
const publicDir = __dirname + '/../public/';


const routes = {
	'/': (req, res) => {
		renderHTML(templateDir + 'home-table.html', res);
	},
	'/home': (req, res) => {
		renderHTML(templateDir + 'home-table.html', res);
	},
	'/test': (req, res) => {
		const paramsUrl = new URLSearchParams(req.data.queryStringObject);
		
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
	'/api/workers': (req, res) => {
		const workers = [
			{ name: 'Дима', age: 23, salary: 400 },
			{ name: 'Вася', age: 25, salary: 500 },
			{ name: 'Коля', age: 30, salary: 1000 },
			{ name: 'Иван', age: 27, salary: 500 },
			{ name: 'Кирилл', age: 28, salary: 1000 }
		]
		
		const listMethods = {
			'get': () => {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(workers));
			},
			'post': () => {
				console.log("POST", req.data.payload.workerId);
				
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(workers));
			},
			'put': () => {
				console.log("PUT", req.data.payload.workerId);
				
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(workers));
			},
		}
		
		listMethods[ req.data.method ]();
	},
	'na': (req, res) => {
		renderHTML(templateDir + '404.html', res, 404);
	}
}

module.exports = {
	routes
};
