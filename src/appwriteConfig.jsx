import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('65afd11be9e7d32c036e');
  

export const storage = new Storage(client);
export const databases = new Databases(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
export default client;
