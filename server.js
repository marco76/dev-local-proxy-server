const http = require('http');
const fs = require('fs');

// address of the server that will answer to the requests
const PROXIED_SERVER_HOSTNAME = 'localhost';
const PROXIED_SERVER_PORT = 8080;

// this server port
const SERVER_PROXY_PORT = 3000;

// these requests are not sent to the remote server but served by the local nodejs
const LOCAL_ANSWERS_URL = ['/hello', '/test'];

http.createServer((request, response) => {
    const {method, url, headers} = request;

console.log('[server] got request for url:', url, method);

if (LOCAL_ANSWERS_URL.indexOf(url) > -1 && method === 'GET') {
    console.log('simulating url:', url, method);
    setHeaders(response);

    // remove '/' at the beginning of the file
    // url: /hello -> file: hello.json
    let filename = url.substring(1);

    fs.readFile("./json/" + filename + ".json", (err, data) => {
        if (err) throw err;

    response.write(data);
    response.end();

});
} else {
    proxyRequest(request, response);
}

}).listen(SERVER_PROXY_PORT);

function setHeaders(response) {
    response.setHeader('content-type', 'application/json');
    response.setHeader('access-control-expose-headers', 'errorCode')
    response.setHeader('access-control-allow-credentials', 'true');
    response.setHeader('vary', 'accept-encoding,origin,access-control-request-headers,access-control-request-method,accept-encoding');
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.setHeader('date', new Date());
    response.setHeader('Connection', 'keep-alive');
}

function proxyRequest(request, response) {
    const {method, url, headers} = request;
    console.log('proxying:', url);

    const httpRequestOptions = {
        hostname: PROXIED_SERVER_HOSTNAME,
        port: PROXIED_SERVER_PORT,
        path: url,
        method: method,
        headers: headers
    };

    const proxy = http.request(httpRequestOptions, function (res) {
        response.writeHead(res.statusCode, res.headers);
        res.pipe(response, {
            end: true
        });
    });

    request.pipe(proxy, {
        end: true
    });
}
