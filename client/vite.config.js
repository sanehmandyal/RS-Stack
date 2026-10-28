/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// In development the API runs on :4000; proxying keeps cookies first-party (no CORS needed).
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:4000',
            '/uploads': 'http://localhost:4000',
            '/sitemap.xml': 'http://localhost:4000',
            '/robots.txt': 'http://localhost:4000',
        },
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom'],
                    motion: ['framer-motion'],
                },
            },
        },
    },
    test: { environment: 'jsdom', include: ['src/**/*.test.{js,jsx}'] },
});
