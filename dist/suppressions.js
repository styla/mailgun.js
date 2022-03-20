"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const url_1 = require("url");
const url_join_1 = require("url-join");
const createOptions = {
    headers: { 'Content-Type': 'application/json' },
};
class Bounce {
    constructor(data) {
        this.type = 'bounces';
        this.address = data.address;
        this.code = +data.code;
        this.error = data.error;
        this.created_at = new Date(data.created_at);
    }
}
class Complaint {
    constructor(data) {
        this.type = 'complaints';
        this.address = data.address;
        this.created_at = new Date(data.created_at);
    }
}
class Unsubscribe {
    constructor(data) {
        this.type = 'unsubscribes';
        this.address = data.address;
        this.tags = data.tags;
        this.created_at = new Date(data.created_at);
    }
}
class WhiteList {
    constructor(data) {
        this.type = 'whitelists';
        this.value = data.value;
        this.reason = data.reason;
        this.createdAt = new Date(data.createdAt);
    }
}
class SuppressionClient {
    constructor(request) {
        this.request = request;
        this.models = {
            bounces: Bounce,
            complaints: Complaint,
            unsubscribes: Unsubscribe,
            whitelists: WhiteList,
        };
    }
    _parsePage(id, pageUrl) {
        const parsedUrl = url_1.default.parse(pageUrl, true);
        const { query } = parsedUrl;
        return {
            id,
            page: query.page,
            address: query.address,
            url: pageUrl,
        };
    }
    _parsePageLinks(response) {
        const pages = Object.entries(response.body.paging);
        return pages.reduce((acc, pair) => {
            const id = pair[0];
            const pageUrl = pair[1];
            acc[id] = this._parsePage(id, pageUrl);
            return acc;
        }, {});
    }
    _parseList(response, Model) {
        const data = {};
        data.items = response.body.items.map((d) => new Model(d));
        data.pages = this._parsePageLinks(response);
        return data;
    }
    _parseItem(response, Model) {
        return new Model(response.body);
    }
    list(domain, type, query) {
        const model = (this.models)[type];
        return this.request
            .get((0, url_join_1.default)('v3', domain, type), query)
            .then((response) => this._parseList(response, model));
    }
    get(domain, type, address) {
        const model = (this.models)[type];
        return this.request
            .get((0, url_join_1.default)('v3', domain, type, encodeURIComponent(address)))
            .then((response) => this._parseItem(response, model));
    }
    create(domain, type, data) {
        // supports adding multiple suppressions by default
        let postData;
        if (type === 'whitelists') {
            return this.createWhiteList(domain, data);
        }
        if (!Array.isArray(data)) {
            postData = [data];
        }
        else {
            postData = [...data];
        }
        return this.request
            .post((0, url_join_1.default)('v3', domain, type), JSON.stringify(postData), createOptions)
            .then((response) => response.body);
    }
    destroy(domain, type, address) {
        return this.request
            .delete((0, url_join_1.default)('v3', domain, type, encodeURIComponent(address)))
            .then((response) => response.body);
    }
    createWhiteList(domain, data) {
        return this.request
            .postWithFD((0, url_join_1.default)('v3', domain, 'whitelists'), data, createOptions)
            .then((response) => response.body);
    }
}
exports.default = SuppressionClient;
module.exports = SuppressionClient;
//# sourceMappingURL=suppressions.js.map