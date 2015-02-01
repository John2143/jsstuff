var http = require("http");
var f = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("asdf");
	console.log(req);
});
f.listen(80, "192.168.1.2");
