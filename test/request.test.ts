// jscs:disable requireDotNotation
import formData from 'form-data';

import nock from 'nock';
import { expect } from 'chai';
import Request from '../src/request';
import RequestOptions from '../src/interfaces/RequestOptions';
import APIError from '../src/error';
import APIResponse from '../src/interfaces/ApiResponse';
import { InputFormData } from '../src/interfaces/IFormData';

describe('Request', function() {
    let headers: { [key: string]: string };

    beforeEach(function() {
        headers = {};
        headers.Authorization = `Basic ${ Buffer.from('api:key').toString('base64') }`;
    });

    describe('request', function() {
        it('makes API request', async function() {
            headers.Test = 'Custom Header';
            headers['X-CSRF-Token'] = 'protectme';

            nock('https://api.mailgun.com', { reqheaders: headers })
                .get('/v2/some/resource1')
                .query({ some: 'parameter' })
                .reply(200, {});

            const req = new Request({
                username: 'api',
                key: 'key',
                url: 'https://api.mailgun.com',
                headers: { 'X-CSRF-Token': 'protectme' },
                timeout: 10000,
            }, formData as InputFormData);

            await req.request('get', '/v2/some/resource1', {
                headers: { Test: 'Custom Header', 'X-CSRF-Token': 'protectme' },
                query: { some: 'parameter' },
            });
        });

        it('parses API response', function() {
            nock('https://api.mailgun.com', { reqheaders: headers })
                .get('/v2/some/resource')
                .reply(200, { id: 1, message: 'hello' });

            const req = new Request({
                username: 'api',
                key: 'key',
                url: 'https://api.mailgun.com',
            } as RequestOptions, formData as InputFormData);
            return req.request('get', '/v2/some/resource')
                      .then(function(response: APIResponse) {
                          expect(response.status).to.eql(200);
                          expect(response.body).to.eql({ id: 1, message: 'hello' });
                      });
        });

        it('handles API error', function() {
            nock('https://api.mailgun.com', { reqheaders: headers })
                .get('/v2/some/resource')
                .reply(429, 'Too many requests');

            const req = new Request({
                username: 'api',
                key: 'key',
                url: 'https://api.mailgun.com',
            } as RequestOptions, formData as InputFormData);
            return req.request('get', '/v2/some/resource').catch(function(error: APIError) {
                expect(error.status).to.eql(429);
                expect(error.details).to.eql('Too many requests');
            });
        });
    });

    describe('query', function() {
        const search = { query: 'data' };

        it('sends data as query parameter', async function() {
            nock('https://api.mailgun.com')
                .get('/v2/some/resource2')
                .query(search)
                .reply(200, {});

            const req = new Request({ url: 'https://api.mailgun.com' } as RequestOptions, formData as InputFormData);
            await req.query('get', '/v2/some/resource2', search);
        });
    });

    describe('command', function() {
        const body = { query: 'data' };

        it('sends data as form-encoded request body', function() {
            nock('https://api.mailgun.com')
                .post('/v2/some/resource')
                .reply(200, {});

            const req = new Request({ url: 'https://api.mailgun.com' } as RequestOptions, formData as InputFormData);
            return req.command('post', '/v2/some/resource', body);
        });
    });
});
