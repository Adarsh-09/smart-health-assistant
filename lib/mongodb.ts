import { MongoClient, Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Database features will use in-memory fallback.")
}

const uri = process.env.MONGODB_URI || ""
const options = {}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

/**
 * Returns a cached MongoDB client promise for use in serverless functions.
 * Falls back gracefully if MONGODB_URI is not configured.
 */
export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) return null

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }
  }

  return clientPromise
}

export async function getDb(): Promise<Db | null> {
  const client = await getMongoClient()
  if (!client) return null
  return client.db("health_assistant")
}
