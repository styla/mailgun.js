"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MailListsMembers {
    constructor(request) {
        this.request = request;
        this.baseRoute = '/v3/lists';
    }
    listMembers(mailListAddress, query) {
        return this.request.get(`${this.baseRoute}/${mailListAddress}/members/pages`, query)
            .then((response) => response.body.items);
    }
    getMember(mailListAddress, mailListMemberAddress) {
        return this.request.get(`${this.baseRoute}/${mailListAddress}/members/${mailListMemberAddress}`)
            .then((response) => response.body.member);
    }
    createMember(mailListAddress, data) {
        const reqData = this.checkAndUpdateData(data);
        return this.request.postWithFD(`${this.baseRoute}/${mailListAddress}/members`, reqData)
            .then((response) => response.body.member);
    }
    createMembers(mailListAddress, data) {
        const newData = {
            members: Array.isArray(data.members) ? JSON.stringify(data.members) : data.members,
            upsert: data.upsert,
        };
        return this.request.postWithFD(`${this.baseRoute}/${mailListAddress}/members.json`, newData)
            .then((response) => response.body);
    }
    updateMember(mailListAddress, mailListMemberAddress, data) {
        const reqData = this.checkAndUpdateData(data);
        return this.request.putWithFD(`${this.baseRoute}/${mailListAddress}/members/${mailListMemberAddress}`, reqData)
            .then((response) => response.body.member);
    }
    destroyMember(mailListAddress, mailListMemberAddress) {
        return this.request.delete(`${this.baseRoute}/${mailListAddress}/members/${mailListMemberAddress}`)
            .then((response) => response.body);
    }
    checkAndUpdateData(data) {
        const newData = { ...data };
        if (typeof data.vars === 'object') {
            newData.vars = JSON.stringify(newData.vars);
        }
        if (typeof data.subscribed === 'boolean') {
            newData.subscribed = data.subscribed ? 'yes' : 'no';
        }
        return newData;
    }
}
exports.default = MailListsMembers;
//# sourceMappingURL=mailListMembers.js.map