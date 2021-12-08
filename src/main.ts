import http from "http";

http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        res.end("Hello there!");
    } else if (req.method === "POST" && req.url === "/echo") {
        req.pipe(res);
    } else {
        res.statusCode = 404;
        res.end();
    }
}).listen(8080);
