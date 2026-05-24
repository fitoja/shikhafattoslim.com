import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "shikha_fat_to_slim";

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const mongoUri = uri;

type CachedMongo = {
  client?: MongoClient;
  promise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as typeof globalThis & {
  _ftsMongo?: CachedMongo;
};

const cached = globalForMongo._ftsMongo ?? {};
globalForMongo._ftsMongo = cached;

export async function getMongoClient() {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = new MongoClient(mongoUri).connect();
  }

  cached.client = await cached.promise;
  return cached.client;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}
