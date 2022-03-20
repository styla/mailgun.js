import Request from './request';
import { Stat, StatsOptions, StatsQuery } from './interfaces/StatsOptions';
declare class Stats {
    start: Date;
    end: Date;
    resolution: string;
    stats: Stat[];
    constructor(data: StatsOptions);
}
export default class StatsClient {
    request: Request;
    constructor(request: Request);
    _parseStats(response: {
        body: StatsOptions;
    }): Stats;
    getDomain(domain: string, query?: StatsQuery): Promise<Stats>;
    getAccount(query?: StatsQuery): Promise<Stats>;
    private prepareSearchParams;
}
export {};
