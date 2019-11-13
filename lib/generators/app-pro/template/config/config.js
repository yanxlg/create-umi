
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' }
      ]
    }
  ],
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
      context,
      _$,
      localName,
    ) => {
        if (
            context.resourcePath.includes('node_modules') ||
            context.resourcePath.includes('ant.design.pro.less') ||
            context.resourcePath.includes('global.less') ||
            /_less\/global.less$/.test(context.resourcePath)
        ) {
            return localName;
        }
        // scope classNa名称生成规则
        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
            const antdProPath = match[1].replace('.less', '');
            const arr = slash(antdProPath)
                .split('/')
                .map((a) => a.replace(/([A-Z])/g, '-$1'))
                .map((a) => a.toLowerCase());
            return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
    },
  },<% } %>
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
        default: 'en-US',
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
