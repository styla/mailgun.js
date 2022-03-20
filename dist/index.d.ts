import Client from './client';
import { InputFormData } from './interfaces/IFormData';
import Options from './interfaces/Options';
declare class Mailgun {
    private formData;
    constructor(FormData: InputFormData);
    client(options: Options): Client;
}
export = Mailgun;
