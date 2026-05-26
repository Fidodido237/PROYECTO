import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Por favor, define la variable MONGODB_URI dentro de tu archivo .env.local"
  );
}

interface GlobalMongoose {
  conn: any;
  promise: any;
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: GlobalMongoose;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log("Conexión establecida con MongoDB Atlas con éxito.");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Error al intentar conectar a MongoDB Atlas:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;