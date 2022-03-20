"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_64_1 = require("base-64");
const url_join_1 = require("url-join");
const node_fetch_1 = require("node-fetch");
const error_1 = require("./error");
const isStream = (attachment) => typeof attachment === 'object' && typeof attachment.pipe === 'function';
function isNodeFormData(formDataInstance) {
    return formDataInstance.getHeaders !== undefined;
}
const getAttachmentOptions = (item) => {
    if (typeof item !== 'object' || isStream(item)) {
        return {};
    }
    const { filename, contentType, knownLength, } = item;
    return {
        ...(filename ? { filename } : { filename: 'file' }),
        ...(contentType && { contentType }),
        ...(knownLength && { knownLength }),
    };
};
const streamToString = (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
};
class Request {
    constructor(options, formData) {
        this.username = options.username;
        this.key = options.key;
        this.url = options.url;
        this.timeout = options.timeout;
        this.headers = options.headers || {};
        this.FormDataConstructor = formData;
    }
    async request(method, url, inputOptions) {
        const options = { ...inputOptions };
        const basic = base_64_1.default.encode(`${this.username}:${this.key}`);
        const headers = {
            Authorization: `Basic ${basic}`,
            ...this.headers,
            ...options === null || options === void 0 ? void 0 : options.headers,
        };
        options === null || options === void 0 ? true : delete options.headers;
        if (!headers['Content-Type']) {
            // for form-data it will be Null so we need to remove it
            delete headers['Content-Type'];
        }
        const params = { ...options };
        if ((options === null || options === void 0 ? void 0 : options.query) && Object.getOwnPropertyNames(options === null || options === void 0 ? void 0 : options.query).length > 0) {
            params.searchParams = options.query;
            delete params.query;
        }
        const response = await (0, node_fetch_1.default)((0, url_join_1.default)(this.url, url), {
            method: method.toLocaleUpperCase(),
            headers,
            throwHttpErrors: false,
            timeout: this.timeout,
            ...params,
        });
        if (!(response === null || response === void 0 ? void 0 : response.ok)) {
            const message = (response === null || response === void 0 ? void 0 : response.body) && isStream(response.body)
                ? await streamToString(response.body)
                : await (response === null || response === void 0 ? void 0 : response.json());
            throw new error_1.default({
                status: response === null || response === void 0 ? void 0 : response.status,
                statusText: response === null || response === void 0 ? void 0 : response.statusText,
                body: { message },
            });
        }
        const res = {
            body: await (response === null || response === void 0 ? void 0 : response.json()),
            status: response === null || response === void 0 ? void 0 : response.status,
        };
        return res;
    }
    query(method, url, query, options) {
        return this.request(method, url, { query, ...options });
    }
    command(method, url, data, options) {
        return this.request(method, url, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data,
            ...options,
        });
    }
    get(url, query, options) {
        return this.query('get', url, query, options);
    }
    head(url, query, options) {
        return this.query('head', url, query, options);
    }
    options(url, query, options) {
        return this.query('options', url, query, options);
    }
    post(url, data, options) {
        return this.command('post', url, data, options);
    }
    postWithFD(url, data) {
        if (!data) {
            throw new Error('Please provide data object');
        }
        const params = {
            headers: { 'Content-Type': null },
        };
        const formData = this.createFormData(data);
        return this.command('post', url, formData, params);
    }
    putWithFD(url, data) {
        if (!data) {
            throw new Error('Please provide data object');
        }
        const params = {
            headers: { 'Content-Type': null },
        };
        const formData = this.createFormData(data);
        return this.command('put', url, formData, params);
    }
    patchWithFD(url, data) {
        if (!data) {
            throw new Error('Please provide data object');
        }
        const params = {
            headers: { 'Content-Type': null },
        };
        const formData = this.createFormData(data);
        return this.command('patch', url, formData, params);
    }
    createFormData(data) {
        const formData = Object.keys(data)
            .filter(function (key) {
            return data[key];
        })
            .reduce((formDataAcc, key) => {
            const fileKeys = ['attachment', 'inline', 'file'];
            if (fileKeys.includes(key)) {
                this.addFilesToFD(key, data[key], formDataAcc);
                return formDataAcc;
            }
            if (key === 'message') { // mime message
                this.addMimeDataToFD(key, data[key], formDataAcc);
                return formDataAcc;
            }
            this.addCommonPropertyToFD(key, data[key], formDataAcc);
            return formDataAcc;
        }, new this.FormDataConstructor());
        return formData;
    }
    put(url, data, options) {
        return this.command('put', url, data, options);
    }
    patch(url, data, options) {
        return this.command('patch', url, data, options);
    }
    delete(url, data, options) {
        return this.command('delete', url, data, options);
    }
    addMimeDataToFD(key, data, formDataInstance) {
        if (Buffer.isBuffer(data)) {
            formDataInstance.append(key, data, { filename: 'MimeMessage' });
        }
    }
    addFilesToFD(propertyName, value, formDataInstance) {
        const appendFileToFD = (key, obj, formData) => {
            const isStreamData = isStream(obj);
            const objData = isStreamData ? obj : obj.data;
            // getAttachmentOptions should be called with obj parameter to prevent loosing filename
            const options = getAttachmentOptions(obj);
            formData.append(key, objData, options);
            return;
        };
        if (Array.isArray(value)) {
            value.forEach(function (item) {
                appendFileToFD(propertyName, item, formDataInstance);
            });
        }
        else {
            appendFileToFD(propertyName, value, formDataInstance);
        }
    }
    addCommonPropertyToFD(key, value, formDataAcc) {
        if (Array.isArray(value)) {
            value.forEach(function (item) {
                formDataAcc.append(key, item);
            });
        }
        else if (value != null) {
            formDataAcc.append(key, value);
        }
    }
}
exports.default = Request;
//# sourceMappingURL=request.js.map