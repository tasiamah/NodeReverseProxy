const rp = require('request-promise');

module.exports = class RequestService {
    static async request(method = 'GET', uri = "", data = {}, headers = {}) {
        let options = {
            method: method,
            uri: uri,
            // json: true, // Automatically stringifies the body to JSON
            headers: {
                'User-Agent': 'Tedasi-Proxy-Server',
                ...headers
            },
        };
        switch (method) {
            case 'GET':
            case 'DELETE':
                options.qs = data;
                break;
            case 'POST':
                options.body = data;
                break;

        }

        function transformReq(body, response) {
            return {
                headers: response.headers,
                body,
                statusCode: response.statusCode
            };
        }
        const req = rp.defaults({ transform: transformReq });
        return new Promise(resolve => {
            req(options).then(function (result) {
                resolve({
                    error: null,
                    result: result
                });
            }).catch(function (err) {
                resolve({
                    error: err,
                    result: null
                });
            });
        });
    }
}
