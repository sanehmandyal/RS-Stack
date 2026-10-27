import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    testTimeout: 60000,
    hookTimeout: 120000,
    pool: 'forks',
    env: {
      NODE_ENV: 'test',
      IP_HASH_SALT: 'test-salt-test-salt-test-salt-1234',
      UPLOAD_DIR: '.test-uploads',
      SITE_URL: 'https://rsstack.test',
      CLIENT_ORIGINS: 'https://rsstack.test',
    },
  },
});
