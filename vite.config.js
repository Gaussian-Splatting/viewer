import { defineConfig } from "vite";

export default defineConfig({
    publicDir: "resources",
    // optimizeDeps: {
    //     link: ['@mkkellogg/gaussian-splats-3d'],
    //     disabled: true
    // },
    // server: {
    //     watch: { usePolling: true }
    // },
    build: {
        minify: false
    },
    plugins: [{
        name: "configure-response-headers",
        configureServer: (server) => {
            server.middlewares.use((_req, res, next) => {
                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                next();
            });
        },
        configurePreviewServer: (server) => {
            server.middlewares.use((_req, res, next) => {
                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                next();
            });
        },
    },],
});
