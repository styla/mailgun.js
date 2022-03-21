import { Client } from './client';
import { InputFormData } from './interfaces/IFormData';
import { MailgunOptions } from './interfaces/MailgunOptions';

export { MailgunOptions } from './interfaces/MailgunOptions';
export { DomainClient } from './domains';
export { WebhookClient } from './webhooks';
export { EventClient } from './events';
export { StatsClient } from './stats';
export { SuppressionClient } from './suppressions';
export { MessagesClient } from './messages';
export { RoutesClient } from './routes';
export { IpsClient } from './ips';
export { IpPoolsClient } from './ip-pools';
export { ListsClient } from './lists';
export { ValidateClient } from './validate';

export class Mailgun {
    private readonly formData: InputFormData;

    constructor(FormData: InputFormData) {
        this.formData = FormData;
    }

    client(options: MailgunOptions): Client {
        return new Client(options, this.formData);
    }
}
