import { createApp } from './app.js';
import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

async function main() {
  await connectDb();
  const app = createApp();
  const server = app.listen(env.PORT, () => logger.info(`RS Stack API listening on :${env.PORT} (${env.NODE_ENV})`));

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

process.on('unhandledRejection', (err) => logger.error({ err }, 'unhandledRejection'));

main().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
