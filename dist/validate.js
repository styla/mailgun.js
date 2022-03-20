"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidateClient {
    constructor(request, multipleValidationClient) {
        this.request = request;
        this.multipleValidation = multipleValidationClient;
    }
    get(address) {
        return this.request.get('/v4/address/validate', { address })
            .then((response) => response)
            .then((res) => res.body);
    }
}
exports.default = ValidateClient;
//# sourceMappingURL=validate.js.map