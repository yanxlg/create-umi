import slash from 'slash2';

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
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: "<%= dva%>",
      dynamicImport: false,
      title: "<%= title%>",
      dll: "<%= dll%>",
      locale: {
        enable: "<%= locale%>",
        default: 'en-US',
      },
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  cssLoaderOptions: {
    modules: true, // false 不起作用
    getLocalIdent: (
      context,
      _,
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
  },
  proxy: {
    '/api': {
      target: 'http://vvfeature-t.vova.com.hk/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
}
