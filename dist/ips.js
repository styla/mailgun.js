"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IpsClient {
    constructor(request) {
        this.request = request;
    }
    list(query) {
        return this.request.get('/v3/ips', query)
            .then((response) => this.parseIpsResponse(response));
    }
    get(ip) {
        return this.request.get(`/v3/ips/${ip}`)
            .then((response) => this.parseIpsResponse(response));
    }
    parseIpsResponse(response) {
        return response.body;
    }
}
exports.default = IpsClient;
//# sourceMappingURL=ips.js.map