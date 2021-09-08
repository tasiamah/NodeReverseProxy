const http = require('http');
const connect = require('connect');
const downStreamServers = require('./downStreamServers/');
const { config } = require('./config/');
const { handleRequest } = require('./proxy/');

//running down Stream Servers
if(config.startDownStreamServers) {
    downStreamServers.init();
}

// Basic Connect App
var app = connect();

app.use(handleRequest)

//creating proxy server to listen for clients
const server = http.createServer(app);
const PORT = config.proxy && config.proxy.listen ? config.proxy.listen.port: (process.env.PORT || 8080);
server.listen(PORT, function () {
    console.log('Proxy server listening on port %s', PORT);
});

