/* eslint-disable camelcase */
export interface Route {
    actions: string[];
    created_at: string;
    description: string;
    expression: string;
    id: string;
    priority: number;
}

export interface UpdateRouteResponse extends Route {
    message: string;
}

export interface DestroyRouteResponse {
    id: string;
    message: string;
}

export interface CreateUpdateRouteData {
    priority?: number;
    description?: string;
    expression: string;
    action: string[];
}

export interface RoutesListQuery {
    limit?: number;
    skip?: number;
}
