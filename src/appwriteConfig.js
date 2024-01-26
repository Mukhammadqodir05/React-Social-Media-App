import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

const VITE_APPWRITE_URL = 'https://cloud.appwrite.io/v1';
const VITE_APPWRITE_PROJECT_ID = '65afd11be9e7d32c036e';
const VITE_APPWRITE_SRORAGE_ID = '65b08fcfcc06a2752433';
const VITE_APPWRITE_DATABASE_ID = '65b090c1dc0ec3d27fa2';
const VITE_APPWRITE_SAVES_COLLECTION_ID = '65b0915dae71e2ea033b';
const VITE_APPWRITE_POST_COLLECTION_ID = '65b091014ca9f3d60b0a';
const VITE_APPWRITE_USER_COLLECTION_ID = '65b09132c840e4549f2c';

const client = new Client();

client
  .setEndpoint(VITE_APPWRITE_URL)
  .setProject(VITE_APPWRITE_PROJECT_ID);
  

export const storage = new Storage(client);
export const databases = new Databases(client);
export const account = new Account(client);
export const avatars = new Avatars(client);

export {
  VITE_APPWRITE_URL,
  VITE_APPWRITE_PROJECT_ID,
  VITE_APPWRITE_SRORAGE_ID,
  VITE_APPWRITE_DATABASE_ID,
  VITE_APPWRITE_SAVES_COLLECTION_ID,
  VITE_APPWRITE_POST_COLLECTION_ID,
  VITE_APPWRITE_USER_COLLECTION_ID
};

export default client;
