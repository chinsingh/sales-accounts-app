import jsforce from "jsforce";
import dotenv from "dotenv";
dotenv.config();
class SalesforceAccounts {
    async getAll() {
        const loginUrl = process.env.SF_LOGIN_URL;
        const conn = new jsforce.Connection({
            instanceUrl: process.env.SF_INSTANCE_URL,
            oauth2: {
                clientId: process.env.SF_CLIENT_ID,
                clientSecret: process.env.SF_CLIENT_SECRET,
                loginUrl,
            },
        });
        await conn.authorize({ grant_type: "client_credentials" });
        const res = await conn.query("SELECT name, website, type, description, phone, billingAddress, shippingAddress FROM Account");
        return res.records.map((accountRecord, index) => {
            const { attributes, ...account } = accountRecord;
            return { id: index + 1, ...account };
        });
    }
    async get(limit, offset) {
        const loginUrl = process.env.SF_LOGIN_URL;
        const conn = new jsforce.Connection({
            instanceUrl: process.env.SF_INSTANCE_URL,
            oauth2: {
                clientId: process.env.SF_CLIENT_ID,
                clientSecret: process.env.SF_CLIENT_SECRET,
                loginUrl,
            },
        });
        await conn.authorize({ grant_type: "client_credentials" });
        const res = await conn.query(`SELECT name, website, type, description, phone, billingAddress, shippingAddress FROM Account
          ORDER BY name ASC
          LIMIT ${limit} OFFSET ${offset}`);
        return res.records.map((accountRecord, index) => {
            const { attributes, ...account } = accountRecord;
            return { id: index + 1, ...account };
        });
    }
    async count() {
        const loginUrl = process.env.SF_LOGIN_URL;
        const conn = new jsforce.Connection({
            instanceUrl: process.env.SF_INSTANCE_URL,
            oauth2: {
                clientId: process.env.SF_CLIENT_ID,
                clientSecret: process.env.SF_CLIENT_SECRET,
                loginUrl,
            },
        });
        await conn.authorize({ grant_type: "client_credentials" });
        return conn.sobject('Account').count();
    }
}
export default new SalesforceAccounts();
//# sourceMappingURL=sf-accounts.service.js.map