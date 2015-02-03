var http = require("http");
var fs = require("fs");
var f = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("<script>alert('lmao');</script>");
	var f = __dirname + "\\main.js";
	fs.readFile(f, function(e, d) {
		console.log(d);
		for(i in d) {
			if(/read/.exec(i))
				console.log(i);
		}
	})
});
f.listen(80, "192.168.1.2");
