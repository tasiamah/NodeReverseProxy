/**
 * Node in memory cache
 */
const Cache = function(ttlSeconds){
    let cache= {};
    return {
        get: function(key) {
            if(!cache[key] || typeof cache[key] === 'undefined') {
                return null;
            }
            let val = cache[key];
            let diff = (new Date().getTime() - val.timestamp.getTime()) / 1000;
            if (diff > ttlSeconds) { //cache expire
                delete cache[key];
                return null;
            }
            return cache[key].value;
        },
        set: function(key, value){
            cache[key] = {
                timestamp: new Date(),
                value: value
            };
        },
        delete: function(key){
            delete cache[key];
        }
    }
};


module.exports = Cache;
