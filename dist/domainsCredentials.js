"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_join_1 = require("url-join");
class DomainCredentialsClient {
    constructor(request) {
        this.request = request;
        this.baseRoute = '/v3/domains/';
    }
    list(domain, query) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/credentials'), query)
            .then((res) => this._parseDomainCredentialsList(res));
    }
    create(domain, data) {
        return this.request.postWithFD(`${this.baseRoute}${domain}/credentials`, data)
            .then((res) => this._parseMessageResponse(res));
    }
    update(domain, credentialsLogin, data) {
        return this.request.putWithFD(`${this.baseRoute}${domain}/credentials/${credentialsLogin}`, data)
            .then((res) => this._parseMessageResponse(res));
    }
    destroy(domain, credentialsLogin) {
        return this.request.delete(`${this.baseRoute}${domain}/credentials/${credentialsLogin}`)
            .then((res) => this._parseDeletedResponse(res));
    }
    _parseDomainCredentialsList(response) {
        return {
            items: response.body.items,
            totalCount: response.body.total_count,
        };
    }
    _parseMessageResponse(response) {
        const result = {
            status: response.status,
            message: response.body.message,
        };
        return result;
    }
    _parseDeletedResponse(response) {
        const result = {
            status: response.status,
            message: response.body.message,
            spec: response.body.spec,
        };
        return result;
    }
}
exports.default = DomainCredentialsClient;
//# sourceMappingURL=domainsCredentials.js.map