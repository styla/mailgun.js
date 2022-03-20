"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IpPoolsClient {
    constructor(request) {
        this.request = request;
    }
    list(query) {
        return this.request.get('/v1/ip_pools', query)
            .then((response) => this.parseIpPoolsResponse(response));
    }
    create(data) {
        return this.request.postWithFD('/v1/ip_pools', data)
            .then((response) => response === null || response === void 0 ? void 0 : response.body);
    }
    update(poolId, data) {
        return this.request.patchWithFD(`/v1/ip_pools/${poolId}`, data)
            .then((response) => response === null || response === void 0 ? void 0 : response.body);
    }
    delete(poolId, data) {
        return this.request.delete(`/v1/ip_pools/${poolId}`, data)
            .then((response) => response === null || response === void 0 ? void 0 : response.body);
    }
    parseIpPoolsResponse(response) {
        return response.body.ip_pools;
    }
}
exports.default = IpPoolsClient;
//# sourceMappingURL=ip-pools.js.map