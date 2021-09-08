const roundRobin = require('./roundrobin');

const utils = {
    ...roundRobin,
    getRandomNumber: function(min, max) {
        //generating random number
        return Math.floor(Math.random() * max) + min;
    },
    getRandomServer: function(servers) {
        const randNum = utils.getRandomNumber(1,servers.length) - 1;
        return servers[randNum];
    }
}
module.exports = utils;
