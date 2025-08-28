import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        // npm run build 打包前需要注释掉代理部分
        // 否则打包后会自动应用这段代理后端为Spring Boot 4快照版本
        // 还要处理跨域
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
        },
    },
    build: {
        sourcemap: false,
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output:{
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    }
}) 