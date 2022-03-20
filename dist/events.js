"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_join_1 = require("url-join");
class EventClient {
    constructor(request) {
        this.request = request;
    }
    _parsePageNumber(url) {
        return url.split('/').pop() || '';
    }
    _parsePage(id, url) {
        return { id, number: this._parsePageNumber(url), url };
    }
    _parsePageLinks(response) {
        const pages = Object.entries(response.body.paging);
        return pages.reduce((acc, pair) => {
            const id = pair[0];
            const url = pair[1];
            acc[id] = this._parsePage(id, url);
            return acc;
        }, {});
    }
    _parseEventList(response) {
        return {
            items: response.body.items,
            pages: this._parsePageLinks(response),
        };
    }
    get(domain, query) {
        let url;
        const queryCopy = { ...query };
        if (queryCopy && queryCopy.page) {
            url = (0, url_join_1.default)('/v3', domain, 'events', queryCopy.page);
            delete queryCopy.page;
        }
        else {
            url = (0, url_join_1.default)('/v3', domain, 'events');
        }
        return this.request.get(url, queryCopy)
            .then((response) => this._parseEventList(response));
    }
}
exports.default = EventClient;
//# sourceMappingURL=events.js.map