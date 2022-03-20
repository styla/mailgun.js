"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_join_1 = require("url-join");
class Webhook {
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }
}
class WebhookClient {
    constructor(request) {
        this.request = request;
    }
    _parseWebhookList(response) {
        return response.body.webhooks;
    }
    _parseWebhookWithID(id) {
        return function (response) {
            var _a;
            const webhookResponse = (_a = response === null || response === void 0 ? void 0 : response.body) === null || _a === void 0 ? void 0 : _a.webhook;
            let url = webhookResponse === null || webhookResponse === void 0 ? void 0 : webhookResponse.url;
            if (!url) {
                url = (webhookResponse === null || webhookResponse === void 0 ? void 0 : webhookResponse.urls) && webhookResponse.urls.length
                    ? webhookResponse.urls[0]
                    : undefined;
            }
            return new Webhook(id, url);
        };
    }
    _parseWebhookTest(response) {
        return { code: response.body.code, message: response.body.message };
    }
    list(domain, query) {
        return this.request.get((0, url_join_1.default)('/v3/domains', domain, 'webhooks'), query)
            .then(this._parseWebhookList);
    }
    get(domain, id) {
        return this.request.get((0, url_join_1.default)('/v3/domains', domain, 'webhooks', id))
            .then(this._parseWebhookWithID(id));
    }
    create(domain, id, url, test = false) {
        if (test) {
            return this.request.putWithFD((0, url_join_1.default)('/v3/domains', domain, 'webhooks', id, 'test'), { url })
                .then(this._parseWebhookTest);
        }
        return this.request.postWithFD((0, url_join_1.default)('/v3/domains', domain, 'webhooks'), { id, url })
            .then(this._parseWebhookWithID(id));
    }
    update(domain, id, url) {
        return this.request.putWithFD((0, url_join_1.default)('/v3/domains', domain, 'webhooks', id), { url })
            .then(this._parseWebhookWithID(id));
    }
    destroy(domain, id) {
        return this.request.delete((0, url_join_1.default)('/v3/domains', domain, 'webhooks', id))
            .then(this._parseWebhookWithID(id));
    }
}
exports.default = WebhookClient;
//# sourceMappingURL=webhooks.js.map