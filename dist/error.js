"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIError extends Error {
    constructor({ status, statusText, message, body = {}, }) {
        const { message: bodyMessage, error } = body;
        super();
        this.stack = '';
        this.status = status;
        this.message = message || error || statusText;
        this.details = bodyMessage;
    }
}
exports.default = APIError;
//# sourceMappingURL=error.js.map