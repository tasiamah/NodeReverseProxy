const { request } = require('../httpRequest/');
const CacheClient = require('../cache/');
const { config } = require('../config/');
const { roundRobin ,getRandomServer } = require('../utils');

const cache = new CacheClient(config.proxyCacheTTLSeconds || 60);

const services =  config.proxy && config.proxy.services ? config.proxy.services[0].hosts : [];
const servers = services.map(service => service.address+':'+service.port);

let roundServerIndexes = [], roundIndex=0;
if(config.strategy === 'roundrobin'){
    //default is round robin
    roundServerIndexes = roundRobin(servers);
}

const Proxy = {
    handleRequest: async (req, res) => {
        let method = req.method, nextServer, host = '';
        if(config.strategy === 'random') {
            nextServer = getRandomServer;
            host = 'http://'+nextServer(servers);
        } else {
            //default is round robin
            let nextIndex = 0;
            if(roundIndex >= roundServerIndexes.length ) {
                roundIndex = 0;
                nextIndex = roundIndex;
            } else {
                nextIndex = roundIndex;
                roundIndex++;
            }
            host = 'http://'+ servers[roundServerIndexes[nextIndex]];
        }
        let url = host + req.originalUrl;
        let headers = req.headers;
        let reqData = {};
        if (method !== 'GET') {
            reqData = req.body;
        }
        let cacheResponse = cache.get(url);
        if(cacheResponse) {
            return Proxy.writeResponse(res, cacheResponse);
        }
        const {error, result } = await request(method, url, reqData, headers);
        if(error) {
            return Proxy.writeResponse(res, null, error);
        }
        cache.set(url, result);
        Proxy.writeResponse(res, result);
    },
    writeResponse: function(res, result, error) {
        if(error) {
            res.writeHead(502, '');
            res.write('Bad Gateway');
            return res.end();
        }
        res.writeHead(result.statusCode, { ...result.headers });
        res.write(result.body || '');
        res.end();
    }
}
module.exports = Proxy;
