
const cache = {};

export default {
    get: (key) => {
        var cached = cache[key] || {};

        if (false
            || !cached.ttl
            || +cached.ttl <= +new Date()) {
            // Expired
            delete cache[key];
        }

        return cached.value;
    },

    set: (key, value, ttl = 10 * 60 * 1000) => {
        cache[key] = {
            value,
            ttl: Date.now() + ttl
        };
    }
};
