import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 开发服务器配置
    server: {
      port: 5173,
      open: true,
      proxy:
        env.VITE_ENABLE_PROXY === 'true'
          ? {
              '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
              },
            }
          : undefined,
    },
    // 构建配置
    build: {
      target: 'esnext',
      sourcemap: mode === 'development',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // 分块策略
          manualChunks: {
            // React 核心 + 路由 + 数据流
            'vendor-core': ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
            // UI 组件 + 图标 + 通知
            'vendor-ui': ['lucide-react', '@radix-ui/react-slot', 'sonner'],
            // 表单相关
            'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // 工具库
            'vendor-utils': ['zustand', 'ky', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          },
          // 文件命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  }
})
