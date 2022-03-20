"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListsClient {
    constructor(request, members) {
        this.request = request;
        this.baseRoute = '/v3/lists';
        this.members = members;
    }
    list(query) {
        return this.request.get(`${this.baseRoute}/pages`, query)
            .then((response) => response.body.items);
    }
    get(mailListAddress) {
        return this.request.get(`${this.baseRoute}/${mailListAddress}`)
            .then((response) => response.body.list);
    }
    create(data) {
        return this.request.postWithFD(this.baseRoute, data)
            .then((response) => response.body.list);
    }
    update(mailListAddress, data) {
        return this.request.putWithFD(`${this.baseRoute}/${mailListAddress}`, data)
            .then((response) => response.body.list);
    }
    destroy(mailListAddress) {
        return this.request.delete(`${this.baseRoute}/${mailListAddress}`)
            .then((response) => response.body);
    }
}
exports.default = ListsClient;
//# sourceMappingURL=lists.js.map