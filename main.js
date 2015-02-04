var http = require("http");
var fs = require("fs");
var f = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.setHeader('Location', url);
	res.end('Redirecting to '+url);
});
f.listen(80, "192.168.1.2");
