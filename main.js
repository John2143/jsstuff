var http = require("http");
var doRedirect = function(res, redir){
	res.statusCode = 302;
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Location', redir);
	res.end('Redirecting to '+ redir);
};
var doHTML = function(res, html){
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html");
	res.end(html);
};
var retport = function(res, a){doRedirect(res, "http://john2143.com:" + (a || 80))};
var servers = {
	source: 27015,
	source2: 27016,
	gen: 7777,
	gen2: 7778,
	mc: 25555,
	mc2: 25556,
	web: 80,
	web2: 8000,
	web3: 8080,
};
const chunks = [
	"<div><b>",
	":</b> ",
	"</div>"
];
var listServers = function(res, redir){
	var html = [];
	var ind;
	for(var i in servers){
		ind = 0;
		html.push(chunks[ind++]);
		html.push(i);
		html.push(chunks[ind++]);
		html.push(servers[i]);
		html.push(chunks[ind++]);
	}
	doHTML(res, html.join(''));
}
var redirs = {
	git: "https://github.com/John2143658709/",
	server: "ts3server://uk-voice2.fragnet.net:9992",
	p: retport,
	_def: "git",
	list: listServers,
};
var f = http.createServer(function(req, res){
	if (req.url === '/favicon.ico'){
		res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		res.end();
		return;
	}
	var reg = /\/([^\/\\]*)\/?(.*)/.exec(req.url);
	var redir, data;
	var redir = reg[1];
	var data = reg[2];
	console.log(req.connection.remoteAddress, redir, data);
	if(redir){
		if(redirs[redir])
			redir = redirs[redir];
		else if(servers[redir])
			redir = retport(servers[redir]);
	}else
		redir = redirs[redirs._def];

	if(!redir){
	}else{
		if(typeof redir == "function")
			redir(res, data);
		else
			doRedirect(res, redir);
	}
});
f.listen(80, "192.168.1.2");
