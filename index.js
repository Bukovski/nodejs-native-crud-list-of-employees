const http = require('http');
const { router } = require('./app');


const port = 8080;
const templateDir = __dirname + '/template/';
const publicDir = __dirname + '/public/';


const server = http.createServer();

server.on('request', router);

server.listen(port);

server.on('listening', function() {
	console.log('http://127.0.0.1:' + port);
});
