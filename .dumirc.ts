import { defineConfig } from 'dumi';
import path from 'path';
const proxy = require('./config/proxy.ts');

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'react-gov-ui',
  },
  proxy,
  alias: {
    '@': path.resolve(__dirname, '.dumi'),
  },
});
