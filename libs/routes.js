const fs = require('fs');
const { URLSearchParams } = require('url');
const { renderHTML } = require('./requestHandlers');
const { arrayRemove, isNumber, getStaticAsset } = require('./helpers');

const templateDir = __dirname + '/../template/';
const publicDir = __dirname + '/../public/';


let workers = [
	{ id: 1, name: 'Дима', age: 23, salary: 400 },
	{ id: 2, name: 'Вася', age: 25, salary: 500 },
	{ id: 3, name: 'Коля', age: 30, salary: 1000 },
	{ id: 4, name: 'Иван', age: 27, salary: 500 },
	{ id: 5, name: 'Кирилл', age: 28, salary: 1000 }
]

const routes = {};

// Ping handler
routes.home = function(data, callback) {
	callback(200, {'name':'sample handler'});
};

routes.notFound = function(data, callback) {
	callback(404);
};


/********************** WORKERS *************************/

routes.workers = function(data, callback) {
	const acceptableMethods = [ 'get', 'post', 'put', 'delete' ];
	
	if (acceptableMethods.includes(data.method)) {
		routes._workers[ data.method ](data, callback); //[ get ](data, callback)
		
		console.log(data.method, data, callback, routes._workers)
	} else {
		callback(405);
	}
};

routes._workers = {};

routes._workers.get = function(data, callback) {
	callback(200, workers);
};

routes._workers.post = function(data, callback) {
	const workerId = isNumber(data.payload.workerId) ? parseInt(data.payload.workerId) : false;
	
	if (workerId) {
		workers = arrayRemove(workers, workerId);
		
		callback(200, workers);
	} else {
		callback(400,{'Error' : 'Missing required field'})
	}
};



const route = {
	'/': (req, res) => {
		renderHTML(templateDir + 'home-table.html', res);
	},
	'/home': (req, res) => {
		renderHTML(templateDir + 'home-table.html', res);
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
		const listMethods = {
			'get': () => {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(workers));
			},
			'post': () => {
				const { workerId } = req.data.payload;
				
				workers = arrayRemove(workers, workerId);
				
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(workers));
			}
		}
		
		listMethods[ req.data.method ]();
	},
	'na': (req, res) => {
		renderHTML(templateDir + '404.html', res, 404);
	}
}


module.exports = routes;
