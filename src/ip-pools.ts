/* eslint-disable camelcase */
import { Request } from './request';

import { IpPool, IpPoolListResponse, IpPoolUpdateData } from './interfaces/IpPools';

export class IpPoolsClient {
    request: Request;

    constructor(request: Request) {
        this.request = request;
    }

    private static parseIpPoolsResponse(response: { body: any }) {
        return response.body.ip_pools;
    }

    list(query: any): Promise<IpPool[]> {
        return this.request.get('/v1/ip_pools', query)
                   .then((response: IpPoolListResponse) => IpPoolsClient.parseIpPoolsResponse(response));
    }

    create(data: { name: string, description?: string, ips?: string[] }) {
        return this.request.postWithFD('/v1/ip_pools', data)
                   .then((response: { body: { message: string, pool_id: string } }) => response?.body);
    }

    update(
        poolId: string,
        data: IpPoolUpdateData,
    ): Promise<any> {
        return this.request.patchWithFD(`/v1/ip_pools/${ poolId }`, data)
                   .then((response: { body: any }) => response?.body);
    }

    delete(
        poolId: string,
        data: { id: string, pool_id: string },
    ) {
        return this.request.delete(`/v1/ip_pools/${ poolId }`, data)
                   .then((response: { body: any }) => response?.body);
    }
}
