import { Client, Account, Databases, TablesDB } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const tablesDB = new TablesDB(client);

const appwriteConfig = {
    db: '696c6ffc0001edc93922',
    mails: 'mails',
    messages: 'messages'
} as const;



export type Mail = {
    address: string;
    expiresAt: Date;
    ip?: string;
    active?: boolean;
}

export { client, account, databases, appwriteConfig,tablesDB };



