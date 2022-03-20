"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainTagStatistic = exports.DomainTag = void 0;
const url_join_1 = require("url-join");
class DomainTag {
    constructor(tagInfo) {
        this.tag = tagInfo.tag;
        this.description = tagInfo.description;
        this['first-seen'] = new Date(tagInfo['first-seen']);
        this['last-seen'] = new Date(tagInfo['last-seen']);
    }
}
exports.DomainTag = DomainTag;
class DomainTagStatistic {
    constructor(tagStatisticInfo) {
        this.tag = tagStatisticInfo.body.tag;
        this.description = tagStatisticInfo.body.description;
        this.start = new Date(tagStatisticInfo.body.start);
        this.end = new Date(tagStatisticInfo.body.end);
        this.resolution = tagStatisticInfo.body.resolution;
        this.stats = tagStatisticInfo.body.stats.map(function (stat) {
            const res = { ...stat, time: new Date(stat.time) };
            return res;
        });
    }
}
exports.DomainTagStatistic = DomainTagStatistic;
class DomainTagsClient {
    constructor(request) {
        this.request = request;
        this.baseRoute = '/v3/';
    }
    list(domain, query) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/tags'), query)
            .then((res) => this._parseDomainTagsList(res));
    }
    get(domain, tag) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/tags', tag))
            .then((res) => new DomainTag(res.body));
    }
    update(domain, tag, description) {
        return this.request.put((0, url_join_1.default)(this.baseRoute, domain, '/tags', tag), description)
            .then((res) => res.body);
    }
    destroy(domain, tag) {
        return this.request.delete(`${this.baseRoute}${domain}/tags/${tag}`)
            .then((res) => ({
            message: res.body.message,
            status: res.status,
        }));
    }
    statistic(domain, tag, query) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/tags', tag, 'stats'), query)
            .then((res) => this._parseTagStatistic(res));
    }
    countries(domain, tag) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/tags', tag, 'stats/aggregates/countries'))
            .then((res) => res.body);
    }
    providers(domain, tag) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/tags', tag, 'stats/aggregates/providers'))
            .then((res) => res.body);
    }
    devices(domain, tag) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/tags', tag, 'stats/aggregates/devices'))
            .then((res) => res.body);
    }
    _parsePageLinks(response) {
        const pages = Object.entries(response.body.paging);
        return pages.reduce((acc, entrie) => {
            const id = entrie[0];
            const url = entrie[1];
            acc[id] = {
                id,
                url,
            };
            return acc;
        }, {});
    }
    _parseDomainTagsList(response) {
        return {
            items: response.body.items.map((tagInfo) => new DomainTag(tagInfo)),
            pages: this._parsePageLinks(response),
        };
    }
    _parseTagStatistic(response) {
        return new DomainTagStatistic(response);
    }
}
exports.default = DomainTagsClient;
//# sourceMappingURL=domainsTags.js.map