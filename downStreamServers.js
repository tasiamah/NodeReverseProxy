const http = require('http');

module.exports = {
    init: function() {
        http.createServer(function (req, res) {
            handleResponse(req, res)
        }).listen(3000, function () {})
        http.createServer(function (req, res) {
            handleResponse(req, res)
        }).listen(3001, function () {})
        http.createServer(function (req, res) {
            handleResponse(req, res)
        }).listen(3002, function () {});
        http.createServer(function (req, res) {
            handleResponse(req, res)
        }).listen(3003, function () {})
    }
}
function handleResponse(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
}
