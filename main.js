//ayy lmao this is pretty meta
var http = mrequire("http");
var f = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("<script>window.location.href = 'https://github.com/John2143658709/jsstuff/blob/master/main.js';</script>");
	console.log(req);
});
f.listen(80, "192.168.1.2");
