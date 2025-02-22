const NodeCache = require('node-cache');

class CacheManager {
    constructor(ttlSeconds = 3600) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false
        });
    }

    get(key) {
        const value = this.cache.get(key);
        if (value) {
            console.log(`Cache hit for key: ${key}`);
            return value;
        }
        console.log(`Cache miss for key: ${key}`);
        return null;
    }

    set(key, value, ttl = null) {
        try {
            const success = this.cache.set(key, value, ttl);
            console.log(`Cache set for key: ${key}`);
            return success;
        } catch (error) {
            console.error(`Error setting cache for key ${key}:`, error);
            return false;
        }
    }

    delete(key) {
        return this.cache.del(key);
    }

    flush() {
        return this.cache.flushAll();
    }

    stats() {
        return this.cache.getStats();
    }

    // Helper method for generating cache keys
    static generateKey(prefix, identifier) {
        return `${prefix}:${identifier}`;
    }

    // Method to handle array of keys
    getMultiple(keys) {
        return this.cache.mget(keys);
    }

    // Method to set multiple key-value pairs
    setMultiple(keyValuePairs, ttl = null) {
        const success = this.cache.mset(keyValuePairs.map(({key, value}) => ({
            key,
            val: value,
            ttl: ttl || this.cache.options.stdTTL
        })));
        return success;
    }
}

// Create instances for different cache types
const propertyCache = new CacheManager(7200); // 2 hours TTL for properties
const userCache = new CacheManager(3600); // 1 hour TTL for users
const searchCache = new CacheManager(1800); // 30 minutes TTL for search results

module.exports = {
    CacheManager,
    propertyCache,
    userCache,
    searchCache
};