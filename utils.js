const utils = {
    getRandomNumber: function(min, max) {
        const rndInt = Math.floor(Math.random() * max) + min;
        return rndInt;
    },
    getRandomServer: function(servers) {
        const randNum = utils.getRandomNumber(1,servers.length) - 1;
        return servers[randNum];
    }
}
module.exports = utils;
