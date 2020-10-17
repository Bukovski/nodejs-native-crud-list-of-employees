const {
	arrayRemove, isNumber,
	getStaticAsset, getTemplate
} = require('./helpers');


const routes = {};


/********************** PAGES *************************/

// home/index page
routes.home = function(data, callback) {
	getTemplate('home-table', null,function(err, str) {
		if(!err && str){
			// Return that page as HTML
			callback(200, str, 'html');
		} else {
			callback(500, undefined, 'html');
		}
	});
};

routes.notFound = function(data, callback) {
	getTemplate('404', null,function(err, str) {
		if(!err && str){
			callback(200, str, 'html');
		} else {
			callback(500, undefined, 'html');
		}
	});
};

/********************** STATIC *************************/

// Favicon
routes.favicon = function(data, callback) {
	if(data.method === 'get'){
		getStaticAsset('favicon.ico',function(err,data){
			if(!err && data){
				// Callback the data
				callback(200,data,'favicon');
			} else {
				callback(500);
			}
		});
	} else {
		callback(405);
	}
};

routes.public = function(data,callback){
	if(data.method === 'get' && data.pathname){
		const trimmedAssetName = data.pathname.replace('public/', '').trim();
		
		if (trimmedAssetName.length > 0) {
			// Read in the asset's data
			getStaticAsset(trimmedAssetName, function(err,data) {
				if (!err && data) {
					
					let contentType = 'plain'; //default 'Content-Type'
					
					if (trimmedAssetName.includes('.css')) {
						contentType = 'css';
					}
					
					if (trimmedAssetName.includes('.png')) {
						contentType = 'png';
					}
					
					if (trimmedAssetName.includes('.jpg')) {
						contentType = 'jpg';
					}
					
					if (trimmedAssetName.includes('.ico')) {
						contentType = 'favicon';
					}
					
					callback(200, data, contentType);
				} else {
					callback(404);
				}
			});
		} else {
			callback(404);
		}
		
	} else {
		callback(405);
	}
};

/********************** WORKERS *************************/

let workers = [
	{ id: 1, name: 'Дима', age: 23, salary: 400 },
	{ id: 2, name: 'Вася', age: 25, salary: 500 },
	{ id: 3, name: 'Коля', age: 30, salary: 1000 },
	{ id: 4, name: 'Иван', age: 27, salary: 500 },
	{ id: 5, name: 'Кирилл', age: 28, salary: 1000 }
];


routes.workers = function(data, callback) {
	const acceptableMethods = [ 'get', 'post', 'put', 'delete' ];
	
	if (acceptableMethods.includes(data.method)) {
		routes._workers[ data.method ](data, callback); //[ get ](data, callback)
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



module.exports = routes;
