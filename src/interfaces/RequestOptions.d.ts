import { Options } from './Options';
export interface RequestOptions extends Options {
    headers: any;
    timeout: number;
}
