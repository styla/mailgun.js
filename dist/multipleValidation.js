"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MultipleValidationClient {
    constructor(request) {
        this.request = request;
    }
    list() {
        return this.request.get('/v4/address/validate/bulk')
            .then((response) => response.body);
    }
    get(listId) {
        return this.request.get(`/v4/address/validate/bulk/${listId}`)
            .then((response) => response.body);
    }
    create(listId, file) {
        return this.request.postWithFD(`/v4/address/validate/bulk/${listId}`, file)
            .then((response) => response.body);
    }
    destroy(listId) {
        return this.request.delete(`/v4/address/validate/bulk/${listId}`)
            .then((response) => response);
    }
}
exports.default = MultipleValidationClient;
//# sourceMappingURL=multipleValidation.js.map