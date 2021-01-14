const http = require('http');


const server = http.createServer(function (request, response) {
	console.log("HTTP works!"); //при обновлении страницы выведет в консоль
	
	response.writeHead(200, { 'Content-Type': 'text/html' });
	response.end('<hl>Hello!</hl>'); //выведет на экран
});

server.listen(8080);

console.log('http://127.0.0.1:8080');
