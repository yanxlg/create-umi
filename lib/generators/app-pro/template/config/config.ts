import { IConfig } from 'umi-types';
import theme from './theme.config';

const shajs = require('sha.js');

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
  theme: theme,
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist:true,
  <% if (ssr) { %>ssr: true,
  outputPath: '../public',
  // for dev server
  publicPath: 'http://localhost:8000/',<% } %>
  <% if (reactFeatures.includes('scope')) { %>cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _$: string,
      localName: string,
    ) => {
        const { resourcePath } = context;
        // src下以_开头的文件进行scope转换，其他文件均不进行scope转换
        if (/_[a-zA-Z\.\-_0-9]+\.less$/.test(resourcePath)) {
            const match = resourcePath.match(/src(.*)/);
            if (match && match[1]) {
                const hash = shajs('sha256')
                    .update(resourcePath)
                    .digest('hex')
                    .substr(0, 8); //最大长度
                return `${localName.replace(/([A-Z])/g, '-$1').toLowerCase()}_${hash}`;
            }
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
  uglifyJSOptions(opts:any) {
    if(process.env.NODE_ENV === 'production'){
        opts.uglifyOptions.compress.warnings = false;
        opts.uglifyOptions.compress.drop_debugger = true;
        opts.uglifyOptions.compress.drop_console = true;
    }
    return opts;
  },
  <% if (proxy) { %>proxy: {
    '/api': {
        target: '<%= proxy%>',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
    },
  },<% } %>
}

export default config;
