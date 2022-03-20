"use strict";
const client_1 = require("./client");
class Mailgun {
    constructor(FormData) {
        this.formData = FormData;
    }
    client(options) {
        return new client_1.default(options, this.formData);
    }
}
module.exports = Mailgun;
//# sourceMappingURL=index.js.map