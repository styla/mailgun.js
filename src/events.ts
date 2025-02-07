import { EventsList, EventsPage, EventsResponse, PagesListAccumulator, ParsedPagesList } from './interfaces/Events';

import { Request } from './request';
import { urlJoin } from './utils/urlJoin';

export class EventClient {
    request: Request;

    constructor(request: Request) {
        this.request = request;
    }

    _parsePageNumber(url: string): string {
        return url.split('/').pop() || '';
    }

    _parsePage(
        id: string,
        url: string,
    ): EventsPage {
        return { id, number: this._parsePageNumber(url), url };
    }

    _parsePageLinks(response: EventsResponse): ParsedPagesList {
        const pages = Object.entries(response.body.paging);
        return pages.reduce(
            (
                acc: PagesListAccumulator,
                pair: [ url: string, id: string ],
            ) => {
                const id = pair[0];
                const url = pair[1];
                acc[id] = this._parsePage(id, url);
                return acc;
            }, {},
        ) as unknown as ParsedPagesList;
    }

    _parseEventList(response: EventsResponse): EventsList {
        return {
            items: response.body.items,
            pages: this._parsePageLinks(response),
        };
    }

    get(
        domain: string,
        query?: { page: string },
    ): Promise<EventsList> {
        let url;
        const queryCopy = { ...query };
        if (queryCopy && queryCopy.page) {
            url = urlJoin('/v3', domain, 'events', queryCopy.page);
            delete queryCopy.page;
        } else {
            url = urlJoin('/v3', domain, 'events');
        }
        return this.request.get(url, queryCopy)
                   .then((response: EventsResponse) => this._parseEventList(response));
    }
}
