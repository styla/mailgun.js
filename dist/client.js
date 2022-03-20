"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const request_1 = require("./request");
const domains_1 = require("./domains");
const events_1 = require("./events");
const stats_1 = require("./stats");
const suppressions_1 = require("./suppressions");
const webhooks_1 = require("./webhooks");
const messages_1 = require("./messages");
const routes_1 = require("./routes");
const validate_1 = require("./validate");
const ips_1 = require("./ips");
const ip_pools_1 = require("./ip-pools");
const lists_1 = require("./lists");
const mailListMembers_1 = require("./mailListMembers");
const domainsCredentials_1 = require("./domainsCredentials");
const multipleValidation_1 = require("./multipleValidation");
const domainsTemplates_1 = require("./domainsTemplates");
const domainsTags_1 = require("./domainsTags");
class Client {
    constructor(options, formData) {
        const config = { ...options };
        if (!config.url) {
            config.url = 'https://api.mailgun.net';
        }
        if (!config.username) {
            throw new Error('Parameter "username" is required');
        }
        if (!config.key) {
            throw new Error('Parameter "key" is required');
        }
        /** @internal */
        this.request = new request_1.default(config, formData);
        const mailListsMembers = new mailListMembers_1.default(this.request);
        const domainCredentialsClient = new domainsCredentials_1.default(this.request);
        const domainTemplatesClient = new domainsTemplates_1.default(this.request);
        const domainTagsClient = new domainsTags_1.default(this.request);
        const multipleValidationClient = new multipleValidation_1.default(this.request);
        this.domains = new domains_1.default(this.request, domainCredentialsClient, domainTemplatesClient, domainTagsClient);
        this.webhooks = new webhooks_1.default(this.request);
        this.events = new events_1.default(this.request);
        this.stats = new stats_1.default(this.request);
        this.suppressions = new suppressions_1.default(this.request);
        this.messages = new messages_1.default(this.request);
        this.routes = new routes_1.default(this.request);
        this.ips = new ips_1.default(this.request);
        this.ip_pools = new ip_pools_1.default(this.request);
        this.lists = new lists_1.default(this.request, mailListsMembers);
        this.validate = new validate_1.default(this.request, multipleValidationClient);
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map