/* eslint-disable camelcase */
import {
    ConnectionSettings,
    ConnectionSettingsResponse,
    DestroyedDomainResponse,
    DKIMAuthorityInfo,
    DKIMSelectorInfo,
    DNSRecord,
    DomainInfo,
    DomainListResponseData,
    DomainResponseData,
    DomainShortData,
    DomainsQuery,
    MessageResponse,
    ReplacementForPool,
    UpdatedConnectionSettings,
    UpdatedConnectionSettingsRes,
    UpdatedDKIMAuthority,
    UpdatedDKIMAuthorityResponse,
    UpdatedDKIMSelectorResponse,
    UpdatedWebPrefixResponse,
    WebPrefixInfo,
} from './interfaces/Domains';

import { APIResponse } from './interfaces/ApiResponse';
import { APIError } from './error';
import { APIErrorOptions } from './interfaces/APIErrorOptions';

import { Request } from './request';
import {
    ClickTrackingInfo,
    DomainTrackingData,
    DomainTrackingResponse,
    OpenTrackingInfo,
    UnsubscribeTrackingInfo,
    UpdateDomainTrackingResponse,
    UpdatedOpenTracking,
} from './interfaces/DomainTracking';
import { IDomainCredentials } from './interfaces/DomainCredentials';
import { IDomainTemplatesClient } from './interfaces/DomainTemplates';
import { DomainCredentialsClient } from './domainsCredentials';
import { DomainTemplatesClient } from './domainsTemplates';
import { IDomainTagsClient } from './interfaces/DomainTags';
import { DomainTagsClient } from './domainsTags';
import { urlJoin } from './utils/urlJoin';

export class Domain {
    name: string;
    require_tls: boolean;
    skip_verification: boolean;
    state: string;
    wildcard: boolean;
    spam_action: string;
    created_at: string;
    smtp_password: string;
    smtp_login: string;
    type: string;
    receiving_dns_records: DNSRecord[] | null;
    sending_dns_records: DNSRecord[] | null;

    constructor(
        data: DomainShortData,
        receiving?: DNSRecord[] | null,
        sending?: DNSRecord[] | null,
    ) {
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

export class DomainClient {
    request: Request;
    public domainCredentials: IDomainCredentials;
    public domainTemplates: IDomainTemplatesClient;
    public domainTags: IDomainTagsClient;

    constructor(
        request: Request,
        domainCredentialsClient: DomainCredentialsClient,
        domainTemplatesClient: DomainTemplatesClient,
        domainTagsClient: DomainTagsClient,
    ) {
        this.request = request;
        this.domainCredentials = domainCredentialsClient;
        this.domainTemplates = domainTemplatesClient;
        this.domainTags = domainTagsClient;
    }

    private static _parseMessage(response: DestroyedDomainResponse): MessageResponse {
        return response.body;
    }

    private static _parseDomain(response: DomainResponseData): Domain {
        return new Domain(
            response.body.domain,
            response.body.receiving_dns_records,
            response.body.sending_dns_records,
        );
    }

    private static _parseTrackingSettings(response: DomainTrackingResponse): DomainTrackingData {
        return response.body.tracking;
    }

    private static _parseTrackingUpdate(response: UpdateDomainTrackingResponse): UpdatedOpenTracking {
        return response.body;
    }

    list(query?: DomainsQuery): Promise<Domain[]> {
        return this.request.get('/v3/domains', query)
                   .then((res: APIResponse) => this._parseDomainList(res as DomainListResponseData));
    }

    get(domain: string): Promise<Domain> {
        return this.request.get(`/v3/domains/${ domain }`)
                   .then((res: APIResponse) => DomainClient._parseDomain(res as DomainResponseData));
    }

    create(data: DomainInfo): Promise<Domain> {
        const postObj = { ...data };
        if ('force_dkim_authority' in postObj && typeof postObj.force_dkim_authority === 'boolean') {
            postObj.force_dkim_authority = postObj.toString() === 'true' ? 'true' : 'false';
        }

        return this.request.postWithFD('/v3/domains', postObj)
                   .then((res: APIResponse) => DomainClient._parseDomain(res as DomainResponseData));
    }

    destroy(domain: string): Promise<MessageResponse> {
        return this.request.delete(`/v3/domains/${ domain }`)
                   .then((res: APIResponse) => DomainClient._parseMessage(res as DestroyedDomainResponse));
    }

    getConnection(domain: string): Promise<ConnectionSettings> {
        return this.request.get(`/v3/domains/${ domain }/connection`)
                   .then((res: APIResponse) => res as ConnectionSettingsResponse)
                   .then((res: ConnectionSettingsResponse) => res.body.connection as ConnectionSettings);
    }

    updateConnection(
        domain: string,
        data: ConnectionSettings,
    ): Promise<UpdatedConnectionSettings> {
        return this.request.put(`/v3/domains/${ domain }/connection`, data)
                   .then((res: APIResponse) => res as UpdatedConnectionSettingsRes)
                   .then((res: UpdatedConnectionSettingsRes) => res.body as UpdatedConnectionSettings);
    }

    getTracking(domain: string): Promise<DomainTrackingData> {
        return this.request.get(urlJoin('/v3/domains', domain, 'tracking'))
                   .then(DomainClient._parseTrackingSettings);
    }

    // Tracking

    updateTracking(
        domain: string,
        type: string,
        data: OpenTrackingInfo | ClickTrackingInfo | UnsubscribeTrackingInfo,
    ): Promise<UpdatedOpenTracking> {
        return this.request.putWithFD(urlJoin('/v3/domains', domain, 'tracking', type), data)
                   .then((res: APIResponse) => DomainClient._parseTrackingUpdate(res as UpdateDomainTrackingResponse));
    }

    getIps(domain: string): Promise<string[]> {
        return this.request.get(urlJoin('/v3/domains', domain, 'ips'))
                   .then((response: APIResponse) => response?.body?.items);
    }

    // IPs

    assignIp(
        domain: string,
        ip: string,
    ): Promise<APIResponse> {
        return this.request.postWithFD(urlJoin('/v3/domains', domain, 'ips'), { ip });
    }

    deleteIp(
        domain: string,
        ip: string,
    ): Promise<APIResponse> {
        return this.request.delete(urlJoin('/v3/domains', domain, 'ips', ip));
    }

    linkIpPool(
        domain: string,
        pool_id: string,
    ): Promise<APIResponse> {
        return this.request.postWithFD(urlJoin('/v3/domains', domain, 'ips'), { pool_id });
    }

    unlinkIpPoll(
        domain: string,
        replacement: ReplacementForPool,
    ): Promise<APIResponse> {
        let searchParams = '';
        if (replacement.pool_id && replacement.ip) {
            throw new APIError({
                status: 400,
                statusText: '',
                body: { message: 'Please specify either pool_id or ip (not both)' },
            } as APIErrorOptions);
        } else if (replacement.pool_id) {
            searchParams = `?pool_id=${ replacement.pool_id }`;
        } else if (replacement.ip) {
            searchParams = `?ip=${ replacement.ip }`;
        }
        return this.request.delete(urlJoin('/v3/domains', domain, 'ips', 'ip_pool', searchParams));
    }

    updateDKIMAuthority(
        domain: string,
        data: DKIMAuthorityInfo,
    ): Promise<UpdatedDKIMAuthority> {
        return this.request.put(`/v3/domains/${ domain }/dkim_authority`, {}, { query: `self=${ data.self }` })
                   .then((res: APIResponse) => res as UpdatedDKIMAuthorityResponse)
                   .then((res: UpdatedDKIMAuthorityResponse) => res.body as UpdatedDKIMAuthority);
    }

    updateDKIMSelector(
        domain: string,
        data: DKIMSelectorInfo,
    ): Promise<UpdatedDKIMSelectorResponse> {
        return this.request.put(`/v3/domains/${ domain }/dkim_selector`, {}, { query: `dkim_selector=${ data.dkimSelector }` })
                   .then((res: APIResponse) => res as UpdatedDKIMSelectorResponse);
    }

    updateWebPrefix(
        domain: string,
        data: WebPrefixInfo,
    ): Promise<UpdatedWebPrefixResponse> {
        return this.request.put(`/v3/domains/${ domain }/web_prefix`, {}, { query: `web_prefix=${ data.webPrefix }` })
                   .then((res: APIResponse) => res as UpdatedWebPrefixResponse);
    }

    private _parseDomainList(response: DomainListResponseData): Domain[] {
        return response.body.items.map(function(item) {
            return new Domain(item);
        });
    }
}
