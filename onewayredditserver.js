const http = require("http");

let owrData = null;

let server = http.createServer((req, res) => {
    console.log(req.method);
    if(req.method === "POST"){
        let post = "";
        req.on("data", (data) => {
            post += data;
        });
        req.on("end", () => {
            owrData = JSON.parse(post).owr;
            console.log(owrData);
            res.writeHead(200);
            res.end("ok");
        });
    }else if(req.method === "GET"){
        res.writeHead(200);
        if(owrData === null){
            res.end("null");
        }else{
            res.end(owrData);
        }
    }else{
        res.writeHead(404); res.end();
    }
});

server.listen({port: 4444}, () => {
    console.log("listening on", server.address());
});
