"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessagesClient {
    constructor(request) {
        this.request = request;
    }
    _parseResponse(response) {
        if (response.body) {
            return response.body;
        }
        return response;
    }
    create(domain, data) {
        if (data.message) {
            return this.request.postWithFD(`/v3/${domain}/messages.mime`, data)
                .then(this._parseResponse);
        }
        return this.request.postWithFD(`/v3/${domain}/messages`, data)
            .then(this._parseResponse);
    }
}
exports.default = MessagesClient;
//# sourceMappingURL=messages.js.map