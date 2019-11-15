import { IConfig } from 'umi-types';
import theme from './theme.config';

const shajs = require('sha.js');

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
  theme: theme,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  <% if (ssr) { %>ssr: true,
  outputPath: '../public',
  // for dev server
  publicPath: 'http://localhost:8000/',<% } %>
  <% if (proxy) { %>proxy: {
    '/api': {
        target: '<%= proxy%>',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
    },
  },<% } %>
  <% if (reactFeatures.includes('scope')) { %>cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _$: string,
      localName: string,
    ) => {
        if (
            context.resourcePath.includes('node_modules') ||
            context.resourcePath.includes('ant.design.pro.less') ||
            context.resourcePath.includes('global.less') ||
            /(less|_)\S+.less$/.test(context.resourcePath)
        ) {
            return localName;
        }
        // scope classNa名称生成规则
        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
            const hash = shajs('sha256')
                .update(context.resourcePath)
                .digest('hex')
                .substr(0, 8); //最大长度
            return `${localName.replace(/([A-Z])/g, '-$1').toLowerCase()}_${hash}`;
        }
          return localName;
    },
  },<% } %>
  routes: [
    {
        path: '/',
        component: '../layouts/index',
        routes: [
            { path: '/', component: '../pages/index' }
        ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: <% if (reactFeatures.includes('antd')) { %>true<% } else { %>false<% } %>,
      dva: <% if (reactFeatures.includes('dva')) { %>true<% } else { %>false<% } %>,
      dynamicImport: <% if (reactFeatures.includes('dynamicImport')) { %>{ webpackChunkName: true }<% } else { %>false<% } %>,
      title: '<%= name %>',
      dll: <% if (reactFeatures.includes('dll')) { %>true<% } else { %>false<% } %>,
      <% if (reactFeatures.includes('locale')) { %>locale: {
        enable: true,
        default: 'zh-CN',
      },<% } %>
      routes: {
        exclude: [<% if (reactFeatures.includes('dva')) { %>
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,<% } %>
          /components\//,
        ],
      },
    }],
  ],
}

export default config;
