import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';
mongoose.set('strictQuery', true);
// NOTE: untrusted input never reaches filters as objects: query params go through qs() (strings only),
// request bodies are stripped of $-operators by the sanitize middleware and validated with strict zod schemas.
export async function connectDb(uri = env.MONGODB_URI) {
    if (!uri)
        throw new Error('MONGODB_URI is not set');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, autoIndex: !env.isProd });
    logger.info('MongoDB connected');
    return mongoose.connection;
}
export async function disconnectDb() {
    await mongoose.disconnect();
}
export const dbReady = () => mongoose.connection.readyState === 1;
