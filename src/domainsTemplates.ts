import { APIResponse } from './interfaces/ApiResponse';
import { Request } from './request';

import {
    CreateDomainTemplateAPIResponse,
    CreateDomainTemplateVersionAPIResponse,
    CreateDomainTemplateVersionResult,
    DomainTemplate,
    DomainTemplateData,
    DomainTemplatesQuery,
    DomainTemplateUpdateData,
    DomainTemplateUpdateVersionData,
    DomainTemplateVersionData,
    GetDomainTemplateAPIResponse,
    IDomainTemplatesClient,
    ListDomainTemplatesAPIResponse,
    ListDomainTemplatesResult,
    ListDomainTemplateVersionsAPIResponse,
    ListDomainTemplateVersionsResult,
    MutateDomainTemplateVersionAPIResponse,
    MutateDomainTemplateVersionResult,
    NotificationAPIResponse,
    NotificationResult,
    ShortTemplateVersion,
    TemplateQuery,
    TemplateVersion,
    UpdateOrDeleteDomainTemplateAPIResponse,
    UpdateOrDeleteDomainTemplateResult,
} from './interfaces/DomainTemplates';
import { urlJoin } from './utils/urlJoin';

export class DomainTemplateItem implements DomainTemplate {
    name: string;
    description: string;
    createdAt: Date | '';
    createdBy: string;
    id: string;
    version?: TemplateVersion;
    versions?: ShortTemplateVersion[];

    constructor(domainTemplateFromAPI: DomainTemplate) {
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

export class DomainTemplatesClient implements IDomainTemplatesClient {
    baseRoute: string;
    request: Request;

    constructor(request: Request) {
        this.request = request;
        this.baseRoute = '/v3/';
    }

    private static parseCreationResponse(data: CreateDomainTemplateAPIResponse): DomainTemplateItem {
        return new DomainTemplateItem(data.body.template);
    }

    private static parseCreationVersionResponse(
        data: CreateDomainTemplateVersionAPIResponse,
    ): CreateDomainTemplateVersionResult {
        const result: CreateDomainTemplateVersionResult = {} as CreateDomainTemplateVersionResult;
        result.status = data.status;
        result.message = data.body.message;
        if (data.body && data.body.template) {
            result.template = new DomainTemplateItem(data.body.template);
        }
        return result;
    }

    private static parseMutationResponse(
        data: UpdateOrDeleteDomainTemplateAPIResponse,
    ): UpdateOrDeleteDomainTemplateResult {
        const result: UpdateOrDeleteDomainTemplateResult = {} as UpdateOrDeleteDomainTemplateResult;
        result.status = data.status;
        result.message = data.body.message;
        if (data.body && data.body.template) {
            result.templateName = data.body.template.name;
        }
        return result;
    }

    private static parseNotificationResponse(data: NotificationAPIResponse): NotificationResult {
        const result: NotificationResult = {} as NotificationResult;
        result.status = data.status;
        result.message = data.body.message;
        return result;
    }

    private static parseMutateTemplateVersionResponse(
        data: MutateDomainTemplateVersionAPIResponse,
    ): MutateDomainTemplateVersionResult {
        const result: MutateDomainTemplateVersionResult = {} as MutateDomainTemplateVersionResult;
        result.status = data.status;
        result.message = data.body.message;
        if (data.body.template) {
            result.templateName = data.body.template.name;
            result.templateVersion = { tag: data.body.template.version.tag };
        }
        return result;
    }

    private static parseListTemplateVersions(
        response: ListDomainTemplateVersionsAPIResponse,
    ): ListDomainTemplateVersionsResult {
        const data = {} as ListDomainTemplateVersionsResult;

        data.template = new DomainTemplateItem(response.body.template);

        data.pages = response.body.paging;

        return data;
    }

    list(
        domain: string,
        query?: DomainTemplatesQuery,
    ): Promise<ListDomainTemplatesResult> {
        return this.request.get(urlJoin(this.baseRoute, domain, '/templates'), query)
                   .then(
                       (res: APIResponse) => this.parseList(res),
                   );
    }

    get(
        domain: string,
        templateName: string,
        query?: TemplateQuery,
    ): Promise<DomainTemplateItem> {
        return this.request.get(urlJoin(this.baseRoute, domain, '/templates/', templateName), query)
                   .then(
                       (res: GetDomainTemplateAPIResponse) => new DomainTemplateItem(res.body.template),
                   );
    }

    create(
        domain: string,
        data: DomainTemplateData,
    ): Promise<DomainTemplateItem> {
        return this.request.postWithFD(urlJoin(this.baseRoute, domain, '/templates'), data)
                   .then((res: CreateDomainTemplateAPIResponse) => DomainTemplatesClient.parseCreationResponse(res));
    }

    update(
        domain: string,
        templateName: string,
        data: DomainTemplateUpdateData,
    ): Promise<UpdateOrDeleteDomainTemplateResult> {
        return this.request.putWithFD(urlJoin(this.baseRoute, domain, '/templates/', templateName), data)
                   .then((res: UpdateOrDeleteDomainTemplateAPIResponse) => DomainTemplatesClient.parseMutationResponse(res));
    }

    destroy(
        domain: string,
        templateName: string,
    ): Promise<UpdateOrDeleteDomainTemplateResult> {
        return this.request.delete(urlJoin(this.baseRoute, domain, '/templates/', templateName))
                   .then((res: UpdateOrDeleteDomainTemplateAPIResponse) => DomainTemplatesClient.parseMutationResponse(res));
    }

    destroyAll(domain: string): Promise<NotificationResult> {
        return this.request.delete(urlJoin(this.baseRoute, domain, '/templates'))
                   .then((res: NotificationAPIResponse) => DomainTemplatesClient.parseNotificationResponse(res));
    }

    createVersion(
        domain: string,
        templateName: string,
        data: DomainTemplateVersionData,
    ): Promise<CreateDomainTemplateVersionResult> {
        return this.request.postWithFD(urlJoin(this.baseRoute, domain, '/templates/', templateName, '/versions'), data)
                   .then(
                       (res: CreateDomainTemplateVersionAPIResponse) => DomainTemplatesClient.parseCreationVersionResponse(res),
                   );
    }

    getVersion(
        domain: string,
        templateName: string,
        tag: string,
    ): Promise<DomainTemplateItem> {
        return this.request.get(urlJoin(this.baseRoute, domain, '/templates/', templateName, '/versions/', tag))
                   .then(
                       (res: GetDomainTemplateAPIResponse) => new DomainTemplateItem(res.body.template),
                   );
    }

    updateVersion(
        domain: string,
        templateName: string,
        tag: string,
        data: DomainTemplateUpdateVersionData,
    ): Promise<MutateDomainTemplateVersionResult> {
        return this.request.putWithFD(urlJoin(this.baseRoute, domain, '/templates/', templateName, '/versions/', tag), data)
                   .then(
                       // eslint-disable-next-line max-len
                       (res: MutateDomainTemplateVersionAPIResponse) => DomainTemplatesClient.parseMutateTemplateVersionResponse(res),
                   );
    }

    destroyVersion(
        domain: string,
        templateName: string,
        tag: string,
    ): Promise<MutateDomainTemplateVersionResult> {
        return this.request.delete(urlJoin(this.baseRoute, domain, '/templates/', templateName, '/versions/', tag))
            // eslint-disable-next-line max-len
                   .then((res: MutateDomainTemplateVersionAPIResponse) => DomainTemplatesClient.parseMutateTemplateVersionResponse(res));
    }

    listVersions(
        domain: string,
        templateName: string,
        query?: DomainTemplatesQuery,
    ): Promise<ListDomainTemplateVersionsResult> {
        return this.request.get(urlJoin(this.baseRoute, domain, '/templates', templateName, '/versions'), query)
                   .then(
                       (res: ListDomainTemplateVersionsAPIResponse) => DomainTemplatesClient.parseListTemplateVersions(res),
                   );
    }

    private parseList(response: ListDomainTemplatesAPIResponse): ListDomainTemplatesResult {
        const data = {} as ListDomainTemplatesResult;

        data.items = response.body.items.map((d: DomainTemplate) => new DomainTemplateItem(d));

        data.pages = response.body.paging;

        return data;
    }
}
