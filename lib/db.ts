import mongoose from "mongoose";

declare global {
  var _mongoConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

async function createConnection() {
  // Use a global variable to persist the connection across hot-reloads in development
  const cached = global._mongoConn;

  if (cached && cached.conn) {
    return cached.conn;
  }

  if (!cached) {
    global._mongoConn = { conn: null, promise: null };
  }

  if (!global._mongoConn!.promise) {
    const opts = {
      bufferCommands: false,
    };

    global._mongoConn!.promise = mongoose.connect(MONGODB_URI, opts);
  }

  global._mongoConn!.conn = await global._mongoConn!.promise;
  return global._mongoConn!.conn;
}

export default createConnection;
