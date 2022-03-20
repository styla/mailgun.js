import Request from './request';
import { BounceData, ComplaintData, IBounce, IComplaint, IUnsubscribe, IWhiteList, ParsedPage, ParsedPagesList, SuppressionList, SuppressionModels, UnsubscribeData, WhiteListData } from './interfaces/Supressions';
declare class Bounce implements IBounce {
    type: string;
    address: string;
    code: number;
    error: string;
    created_at: Date;
    constructor(data: BounceData);
}
declare class Complaint implements IComplaint {
    type: string;
    address: any;
    created_at: Date;
    constructor(data: ComplaintData);
}
declare class Unsubscribe implements IUnsubscribe {
    type: string;
    address: string;
    tags: any;
    created_at: Date;
    constructor(data: UnsubscribeData);
}
declare class WhiteList implements IWhiteList {
    type: string;
    value: string;
    reason: string;
    createdAt: Date;
    constructor(data: WhiteListData);
}
declare type TModel = typeof Bounce | typeof Complaint | typeof Unsubscribe | typeof WhiteList;
export default class SuppressionClient {
    request: any;
    models: {
        bounces: typeof Bounce;
        complaints: typeof Complaint;
        unsubscribes: typeof Unsubscribe;
        whitelists: typeof WhiteList;
    };
    constructor(request: Request);
    _parsePage(id: string, pageUrl: string): ParsedPage;
    _parsePageLinks(response: {
        body: {
            paging: any;
        };
    }): ParsedPagesList;
    _parseList(response: {
        body: {
            items: any;
            paging: any;
        };
    }, Model: TModel): SuppressionList;
    _parseItem(response: {
        body: any;
    }, Model: TModel): IBounce | IComplaint | IUnsubscribe | IWhiteList;
    list(domain: string, type: SuppressionModels, query: any): Promise<SuppressionList>;
    get(domain: string, type: SuppressionModels, address: string): Promise<IBounce | IComplaint | IUnsubscribe | IWhiteList>;
    create(domain: string, type: string, data: any): any;
    destroy(domain: string, type: string, address: string): any;
    private createWhiteList;
}
export {};
