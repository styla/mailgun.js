"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainTemplateItem = void 0;
const url_join_1 = require("url-join");
class DomainTemplateItem {
    constructor(domainTemplateFromAPI) {
        this.name = domainTemplateFromAPI.name;
        this.description = domainTemplateFromAPI.description;
        this.createdAt = domainTemplateFromAPI.createdAt ? new Date(domainTemplateFromAPI.createdAt) : '';
        this.createdBy = domainTemplateFromAPI.createdBy;
        this.id = domainTemplateFromAPI.id;
        if (domainTemplateFromAPI.version) {
            this.version = domainTemplateFromAPI.version;
            if (domainTemplateFromAPI.version.createdAt) {
                this.version.createdAt = new Date(domainTemplateFromAPI.version.createdAt);
            }
        }
        if (domainTemplateFromAPI.versions && domainTemplateFromAPI.versions.length) {
            this.versions = domainTemplateFromAPI.versions.map((version) => {
                const result = { ...version };
                result.createdAt = new Date(version.createdAt);
                return result;
            });
        }
    }
}
exports.DomainTemplateItem = DomainTemplateItem;
class DomainTemplatesClient {
    constructor(request) {
        this.request = request;
        this.baseRoute = '/v3/';
    }
    list(domain, query) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/templates'), query)
            .then((res) => this.parseList(res));
    }
    get(domain, templateName, query) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/templates/', templateName), query)
            .then((res) => new DomainTemplateItem(res.body.template));
    }
    create(domain, data) {
        return this.request.postWithFD((0, url_join_1.default)(this.baseRoute, domain, '/templates'), data)
            .then((res) => this.parseCreationResponse(res));
    }
    update(domain, templateName, data) {
        return this.request.putWithFD((0, url_join_1.default)(this.baseRoute, domain, '/templates/', templateName), data)
            .then((res) => this.parseMutationResponse(res));
    }
    destroy(domain, templateName) {
        return this.request.delete((0, url_join_1.default)(this.baseRoute, domain, '/templates/', templateName))
            .then((res) => this.parseMutationResponse(res));
    }
    destroyAll(domain) {
        return this.request.delete((0, url_join_1.default)(this.baseRoute, domain, '/templates'))
            .then((res) => this.parseNotificationResponse(res));
    }
    createVersion(domain, templateName, data) {
        return this.request.postWithFD((0, url_join_1.default)(this.baseRoute, domain, '/templates/', templateName, '/versions'), data)
            .then((res) => this.parseCreationVersionResponse(res));
    }
    getVersion(domain, templateName, tag) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/templates/', templateName, '/versions/', tag))
            .then((res) => new DomainTemplateItem(res.body.template));
    }
    updateVersion(domain, templateName, tag, data) {
        return this.request.putWithFD((0, url_join_1.default)(this.baseRoute, domain, '/templates/', templateName, '/versions/', tag), data)
            .then(
        // eslint-disable-next-line max-len
        (res) => this.parseMutateTemplateVersionResponse(res));
    }
    destroyVersion(domain, templateName, tag) {
        return this.request.delete((0, url_join_1.default)(this.baseRoute, domain, '/templates/', templateName, '/versions/', tag))
            // eslint-disable-next-line max-len
            .then((res) => this.parseMutateTemplateVersionResponse(res));
    }
    listVersions(domain, templateName, query) {
        return this.request.get((0, url_join_1.default)(this.baseRoute, domain, '/templates', templateName, '/versions'), query)
            .then((res) => this.parseListTemplateVersions(res));
    }
    parseCreationResponse(data) {
        return new DomainTemplateItem(data.body.template);
    }
    parseCreationVersionResponse(data) {
        const result = {};
        result.status = data.status;
        result.message = data.body.message;
        if (data.body && data.body.template) {
            result.template = new DomainTemplateItem(data.body.template);
        }
        return result;
    }
    parseMutationResponse(data) {
        const result = {};
        result.status = data.status;
        result.message = data.body.message;
        if (data.body && data.body.template) {
            result.templateName = data.body.template.name;
        }
        return result;
    }
    parseNotificationResponse(data) {
        const result = {};
        result.status = data.status;
        result.message = data.body.message;
        return result;
    }
    parseMutateTemplateVersionResponse(data) {
        const result = {};
        result.status = data.status;
        result.message = data.body.message;
        if (data.body.template) {
            result.templateName = data.body.template.name;
            result.templateVersion = { tag: data.body.template.version.tag };
        }
        return result;
    }
    parseList(response) {
        const data = {};
        data.items = response.body.items.map((d) => new DomainTemplateItem(d));
        data.pages = response.body.paging;
        return data;
    }
    parseListTemplateVersions(response) {
        const data = {};
        data.template = new DomainTemplateItem(response.body.template);
        data.pages = response.body.paging;
        return data;
    }
}
exports.default = DomainTemplatesClient;
//# sourceMappingURL=domainsTemplates.js.map