import MgRequest from './request';
import { IpData, IpsListResponseBody } from './interfaces/Ips';

export default class IpsClient {
    request: MgRequest;

    constructor(request: MgRequest) {
        this.request = request;
    }

    private static parseIpsResponse(response: { body: IpsListResponseBody | IpData }) {
        return response.body;
    }

    list(query: any) {
        return this.request.get('/v3/ips', query)
                   .then((response: { body: IpsListResponseBody }) => IpsClient.parseIpsResponse(response));
    }

    get(ip: string) {
        return this.request.get(`/v3/ips/${ ip }`)
                   .then((response: { body: IpData }) => IpsClient.parseIpsResponse(response));
    }
}
