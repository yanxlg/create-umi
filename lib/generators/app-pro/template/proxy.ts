  proxy: {
    '/api': {
      target: '<%= target%>',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    },
  },
  plugins