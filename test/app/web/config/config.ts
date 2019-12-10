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
  ssr: true,
  outputPath: '../public',
  // for dev server
  publicPath: 'http://localhost:8000/',
  
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
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'test',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
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
  
}

export default config;
