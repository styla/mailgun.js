"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_join_1 = require("url-join");
class Stats {
    constructor(data) {
        this.start = new Date(data.start);
        this.end = new Date(data.end);
        this.resolution = data.resolution;
        this.stats = data.stats.map(function (stat) {
            const res = { ...stat };
            res.time = new Date(stat.time);
            return res;
        });
    }
}
class StatsClient {
    constructor(request) {
        this.request = request;
    }
    _parseStats(response) {
        return new Stats(response.body);
    }
    getDomain(domain, query) {
        const searchParams = this.prepareSearchParams(query);
        return this.request.get((0, url_join_1.default)('/v3', domain, 'stats/total'), searchParams)
            .then(this._parseStats);
    }
    getAccount(query) {
        const searchParams = this.prepareSearchParams(query);
        return this.request.get('/v3/stats/total', searchParams)
            .then(this._parseStats);
    }
    prepareSearchParams(query) {
        let searchParams = [];
        if (typeof query === 'object' && Object.keys(query).length) {
            searchParams = Object.entries(query)
                .reduce((arrayWithPairs, currentPair) => {
                const [key, value] = currentPair;
                if (Array.isArray(value) && value.length) {
                    const repeatedProperty = value.map((item) => [key, item]);
                    return [...arrayWithPairs, ...repeatedProperty];
                }
                arrayWithPairs.push([key, value]);
                return arrayWithPairs;
            }, []);
        }
        return searchParams;
    }
}
exports.default = StatsClient;
//# sourceMappingURL=stats.js.map