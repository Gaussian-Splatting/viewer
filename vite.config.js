import path from 'path'
import { defineConfig } from "vite";

export default defineConfig({
    publicDir: "resources",
    optimizeDeps: {
        include: ['@mkkellogg/gaussian-splats-3d'],
    },
    server: {
        watch: { usePolling: true }
    },
    resolve: {
        alias: {
            '@mkkellogg/gaussian-splats-3d': './lib/GaussianSplats3D/build/gaussian-splats-3d.module.js'
        }
    },
    build: {
        minify: false,
        rollupOptions: {}
    },
    plugins: [{
        name: "configure-response-headers",
        configureServer: (server) => {
            server.middlewares.use((_req, res, next) => {
                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                next();
            });
        }
    }],
});
