const http = require('http'),
    connect = require('connect'),
    httpProxy = require('http-proxy');
const roundround = require('roundround');
const CacheClient = require('./cacheService');
const downStreamServers = require('./downStreamServers');
const { config } = require('./config');

if(config.startDownStreamServers) {
    downStreamServers.init();
}
const cache = new CacheClient(config.proxyCacheTTLSeconds || 60);

const services =  config.proxy && config.proxy.services ? config.proxy.services[0].hosts : [];
const servers = services.map(service => service.address+':'+service.port)
console.log('servers', servers);

// var servers =  ['http://192.168.10.220:3000', 'http://192.168.10.220:3001', 'http://192.168.10.220:3002', 'http://192.168.10.220:3003' ]
const nextServer = roundround(servers);
const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    secure: false,
    followRedirects: true,
    selfHandleResponse: true
});
proxy.on('error', function(e) {
    console.log('proxy error', e)
});

const app = connect();
app.use(async function (req, res) {
    req.currentlySelectedTarget = 'http://'+nextServer();
    console.log('target', req.currentlySelectedTarget);
    let result = cache.get(req.currentlySelectedTarget);
    if(result) {
        console.log('cache hit')
        result = JSON.parse(result);
        res.writeHead(200, { 'Content-Type': result['contentType'] });
        res.write(result['body']);
        res.end();
    } else {
        proxy.web(req, res, {
            target: req.currentlySelectedTarget
        })
        proxy.on('proxyRes', function (proxyRes, req, res) {
            var body = [];
            proxyRes.on('data', function (chunk) {
                body.push(chunk);
            });
            proxyRes.on('end', function () {
                body = Buffer.concat(body).toString();
                const cacheSet = {
                    'contentType': proxyRes.headers['content-type'],
                    body: body
                }
                cache.set(req.currentlySelectedTarget, JSON.stringify(cacheSet));
                if(!res.finished) {
                    res.writeHead(200, { 'Content-Type': proxyRes.headers['content-type'] });
                    res.write(body);
                    res.end();
                }
            });
        });
    }
})

const server = http.createServer(app);
const PORT = config.proxy && config.proxy.listen ? config.proxy.listen.port: (process.env.PORT || 8080);
server.listen(PORT, function () {
    console.log('Proxy server listening on port %s', PORT);
});

