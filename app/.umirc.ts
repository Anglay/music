import { defineConfig } from 'umi';

export default defineConfig({
  history: { type: 'hash' },
  title: 'Umi Music',
  metas: [{ 'http-equiv': 'A-UA-Compatible', content: 'IE=Edge,chrome=1' }],
  dynamicImport: {
    loading: '@/components/Loading/index.tsx',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  publicPath: '/app/dist/',
  base: '/app/dist/',
  favicon: '/app/dist/favicon.ico',
});
