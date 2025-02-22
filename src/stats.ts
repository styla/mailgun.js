import { Request } from './request';
import { Stat, StatsOptions, StatsQuery } from './interfaces/StatsOptions';
import { urlJoin } from './utils/urlJoin';

class Stats {
    start: Date;
    end: Date;
    resolution: string;
    stats: Stat[];

    constructor(data: StatsOptions) {
        this.start = new Date(data.start);
        this.end = new Date(data.end);
        this.resolution = data.resolution;
        this.stats = data.stats.map(function(stat: Stat) {
            const res = { ...stat };
            res.time = new Date(stat.time);
            return res;
        });
    }
}

export class StatsClient {
    request: Request;

    constructor(request: Request) {
        this.request = request;
    }

    _parseStats(response: { body: StatsOptions }): Stats {
        return new Stats(response.body);
    }

    getDomain(
        domain: string,
        query?: StatsQuery,
    ): Promise<Stats> {
        const searchParams = this.prepareSearchParams(query);
        return this.request.get(urlJoin('/v3', domain, 'stats/total'), searchParams)
                   .then(this._parseStats);
    }

    getAccount(query?: StatsQuery): Promise<Stats> {
        const searchParams = this.prepareSearchParams(query);
        return this.request.get('/v3/stats/total', searchParams)
                   .then(this._parseStats);
    }

    private prepareSearchParams(query: StatsQuery | undefined): Array<Array<string>> {
        let searchParams = [] as Array<Array<string>>;
        if (typeof query === 'object' && Object.keys(query).length) {
            searchParams = Object.entries(query)
                                 .reduce((
                                     arrayWithPairs,
                                     currentPair,
                                 ) => {
                                     const [ key, value ] = currentPair;
                                     if (Array.isArray(value) && value.length) {
                                         const repeatedProperty = value.map((item) => [ key, item ]);
                                         return [ ...arrayWithPairs, ...repeatedProperty ];
                                     }
                                     arrayWithPairs.push([ key, value ]);
                                     return arrayWithPairs;
                                 }, [] as Array<Array<string>>);
        }

        return searchParams;
    }
}
