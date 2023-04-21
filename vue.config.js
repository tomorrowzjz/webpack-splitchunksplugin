const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // entry: './src/main.js',
  pages: {
    index: {
      entry: './src/main.js',
    },
    testA: {
      entry: './src/testA.js',
    },
    testF: {
      entry: './src/testF.js',
    }
  },
  configureWebpack: (config) => {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          'chunk-loadsh': {
            name: 'chunk-loadsh',
            test: /[\\/]node_modules\/(lodash)[\\/]/,
            priority: -5,
            chunks: 'all'
          },
        },
      },
    }
  },
})
