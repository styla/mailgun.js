import { MailgunOptions } from './MailgunOptions';

export interface RequestOptions extends MailgunOptions {
    headers: any;
    timeout: number;
}
