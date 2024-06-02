import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/login', component: '@/pages/login' },
    { path: '/register', component: '@/pages/register' },
    { path: '/changePassword', component: '@/pages/ChangePasswordPage' },
  ],
  define: { 
    'process.env.REACT_APP_BYTESCALE_KEY': process.env.REACT_APP_BYTESCALE_KEY,
    'process.env.REACT_APP_SOCKET_URL': process.env.REACT_APP_SOCKET_URL,
    'process.env.REACT_APP_API_KEY': process.env.REACT_APP_API_KEY
  },
  // proxy: {
  //   '/api': {
  //     target: 'http://localhost:3000',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api': '' },
  //   },
  // },
  npmClient: 'npm',
});


