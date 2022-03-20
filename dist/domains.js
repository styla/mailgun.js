"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Domain = void 0;
/* eslint-disable camelcase */
const url_join_1 = require("url-join");
const error_1 = require("./error");
class Domain {
    constructor(data, receiving, sending) {
        this.name = data.name;
        this.require_tls = data.require_tls;
        this.skip_verification = data.skip_verification;
        this.state = data.state;
        this.wildcard = data.wildcard;
        this.spam_action = data.spam_action;
        this.created_at = data.created_at;
        this.smtp_password = data.smtp_password;
        this.smtp_login = data.smtp_login;
        this.type = data.type;
        this.receiving_dns_records = receiving || null;
        this.sending_dns_records = sending || null;
    }
}
exports.Domain = Domain;
class DomainClient {
    constructor(request, domainCredentialsClient, domainTemplatesClient, domainTagsClient) {
        this.request = request;
        this.domainCredentials = domainCredentialsClient;
        this.domainTemplates = domainTemplatesClient;
        this.domainTags = domainTagsClient;
    }
    list(query) {
        return this.request.get('/v3/domains', query)
            .then((res) => this._parseDomainList(res));
    }
    get(domain) {
        return this.request.get(`/v3/domains/${domain}`)
            .then((res) => this._parseDomain(res));
    }
    create(data) {
        const postObj = { ...data };
        if ('force_dkim_authority' in postObj && typeof postObj.force_dkim_authority === 'boolean') {
            postObj.force_dkim_authority = postObj.toString() === 'true' ? 'true' : 'false';
        }
        return this.request.postWithFD('/v3/domains', postObj)
            .then((res) => this._parseDomain(res));
    }
    destroy(domain) {
        return this.request.delete(`/v3/domains/${domain}`)
            .then((res) => this._parseMessage(res));
    }
    getConnection(domain) {
        return this.request.get(`/v3/domains/${domain}/connection`)
            .then((res) => res)
            .then((res) => res.body.connection);
    }
    updateConnection(domain, data) {
        return this.request.put(`/v3/domains/${domain}/connection`, data)
            .then((res) => res)
            .then((res) => res.body);
    }
    getTracking(domain) {
        return this.request.get((0, url_join_1.default)('/v3/domains', domain, 'tracking'))
            .then(this._parseTrackingSettings);
    }
    updateTracking(domain, type, data) {
        if (typeof (data === null || data === void 0 ? void 0 : data.active) === 'boolean') {
            throw new error_1.default({
                status: 400,
                statusText: '',
                body: { message: 'Property "active" must contain string value.' },
            });
        }
        return this.request.putWithFD((0, url_join_1.default)('/v3/domains', domain, 'tracking', type), data)
            .then((res) => this._parseTrackingUpdate(res));
    }
    getIps(domain) {
        return this.request.get((0, url_join_1.default)('/v3/domains', domain, 'ips'))
            .then((response) => { var _a; return (_a = response === null || response === void 0 ? void 0 : response.body) === null || _a === void 0 ? void 0 : _a.items; });
    }
    assignIp(domain, ip) {
        return this.request.postWithFD((0, url_join_1.default)('/v3/domains', domain, 'ips'), { ip });
    }
    deleteIp(domain, ip) {
        return this.request.delete((0, url_join_1.default)('/v3/domains', domain, 'ips', ip));
    }
    // Tracking
    linkIpPool(domain, pool_id) {
        return this.request.postWithFD((0, url_join_1.default)('/v3/domains', domain, 'ips'), { pool_id });
    }
    unlinkIpPoll(domain, replacement) {
        let searchParams = '';
        if (replacement.pool_id && replacement.ip) {
            throw new error_1.default({
                status: 400,
                statusText: '',
                body: { message: 'Please specify either pool_id or ip (not both)' },
            });
        }
        else if (replacement.pool_id) {
            searchParams = `?pool_id=${replacement.pool_id}`;
        }
        else if (replacement.ip) {
            searchParams = `?ip=${replacement.ip}`;
        }
        return this.request.delete((0, url_join_1.default)('/v3/domains', domain, 'ips', 'ip_pool', searchParams));
    }
    // IPs
    updateDKIMAuthority(domain, data) {
        return this.request.put(`/v3/domains/${domain}/dkim_authority`, {}, { query: `self=${data.self}` })
            .then((res) => res)
            .then((res) => res.body);
    }
    updateDKIMSelector(domain, data) {
        return this.request.put(`/v3/domains/${domain}/dkim_selector`, {}, { query: `dkim_selector=${data.dkimSelector}` })
            .then((res) => res);
    }
    updateWebPrefix(domain, data) {
        return this.request.put(`/v3/domains/${domain}/web_prefix`, {}, { query: `web_prefix=${data.webPrefix}` })
            .then((res) => res);
    }
    _parseMessage(response) {
        return response.body;
    }
    _parseDomainList(response) {
        return response.body.items.map(function (item) {
            return new Domain(item);
        });
    }
    _parseDomain(response) {
        return new Domain(response.body.domain, response.body.receiving_dns_records, response.body.sending_dns_records);
    }
    _parseTrackingSettings(response) {
        return response.body.tracking;
    }
    _parseTrackingUpdate(response) {
        return response.body;
    }
}
exports.default = DomainClient;
//# sourceMappingURL=domains.js.map