const NodeCache = require('node-cache');

class Cache {

    constructor(ttlSeconds) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false
        });

        this.cache.flushAll();
    }

    get(key) {
        const value = this.cache.get(key);
        return value;
    }

    set(key, value) {
        this.cache.set(key, value);
    }

    del(keys) {
        const value = this.cache.del(keys);
        console.log("cache.del", value);
        return value;
    }

    delStartWith(startStr = '') {
        if (!startStr) {
            return;
        }

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(startStr) === 0) {
                this.del(key);
            }
        }
    }

    flush() {
        this.cache.flushAll();
    }
}


module.exports = Cache;
