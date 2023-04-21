<https://webpack.docschina.org/plugins/split-chunks-plugin/#split-chunks-example-3>&#x20;

Splitchunks是webpack的一个功能，用于优化打包后的文件大小，特别是对于多页面应用时可以将公共的代码打包成一个独立的chunk，从而避免重复加载，提升加载速度。

对于单页面应用，通常只需要将代码打包成一个文件即可，因此不需要使用SplitChunks。不过，如果你使用了一些第三方库或框架，这些公共的代码可以通过设置optimization.splitChunks.cacheGroups将其打包成一个独立的chunk，以提高应用加载速度和运行效率。

Vue多页面打包的优化可以从以下几个方面考虑：

1.  webpack配置优化：在webpack的配置中可以通过以下几种方式优化打包速度和文件大小：

*   配置多线程打包；
*   使用webpack进行代码分割；
*   配置externals，将静态资源库放到CDN上统一管理减少打包体积；
*   使用HappyPack，将代码分解成多个子进程并行运行；
*   配置resolve.alias，将常用模块指定为别名，可以缩短模块路径，加快模块的查找速度；
*   使用webpack-bundle-analyzer分析打包结果，找出打包体积大的模块进行优化。

1.  组件按需加载：按需加载可以大幅提升页面加载速度，针对业务场景进行组件拆分，将不常用的组件拆分出去，使用时再按需加载。
2.  公共代码抽离：在多个页面中存在公共的代码块，可以通过使用webpack的SplitChunks插件将其抽离出来，减少打包体积，加快页面加载速度。
3.  gzip压缩：webpack提供了compression-webpack-plugin插件，可以将打包后的代码进行gzip压缩，减少静态资源的大小。

综合以上优化项，可以一定程度上提升多页面应用的打包速度和性能。

在Webpack中，SplitChunks是用于提取公共代码的插件，从而减少打包出来的代码量，提高代码复用性和打包性能。

SplitChunks插件的主要作用是将代码库中的公共模块提取到一个单独的chunk，从而避免多个模块中重复引用相同的代码块，减少打包后的文件体积。当有多个入口文件时，SplitChunks会将公共代码提取到一个新的chunk中。

在Webpack4中，SplitChunks取代了原本的CommonsChunkPlugin插件成为了提取公共代码的首选插件。SplitChunks插件具备以下几个主要特点:

1.通过optimization.splitChunks.minSize参数可以设置模块的最小大小，只有大于该数值的模块才会被提取。

2.optimization.splitChunks.chunks参数控制对哪些模块进行处理，有三个可选方案：

all - 提取所有模块中的公共代码。\
async - 只提取异步加载的模块公共代码。\
initial - 只提取同步加载的模块公共代码。

3.通过maxInitialRequests、maxAsyncRequests参数限制异步加载模块分别最多分离出多少个chunk。

4.同构应用需要设置optimization.splitChunks.name，此选项尤其重要，它可以避免由于缺失 chunk 名导致相同 chunk 被重复引入。

1.  配置optimization.runtimeChunk来提取chunk runtime代码。

总体来说，SplitChunks插件可以大大提升Webpack项目的代码复用性，减少打包后的体积，提高代码加载效率，优化前端性能，是Webpack值得推荐的一个插件。

# 默认值
```
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```js
# 特点
1.通过optimization.splitChunks.minSize参数可以设置模块的最小大小，只有大于该数值的模块才会被提取。

2.optimization.splitChunks.chunks参数控制对哪些模块进行处理，有三个可选方案：

all - 提取所有模块中的公共代码。
async - 只提取异步加载的模块公共代码。
initial - 只提取同步加载的模块公共代码。

3.通过maxInitialRequests、maxAsyncRequests参数限制异步加载模块分别最多分离出多少个chunk。

4.同构应用需要设置optimization.splitChunks.name，此选项尤其重要，它可以避免由于缺失 chunk 名导致相同 chunk 被重复引入。
5.splitChunks.cacheGroups
缓存组可以继承和/或覆盖来自 splitChunks.* 的任何选项。但是 test、priority 和 reuseExistingChunk 只能在缓存组级别上进行配置。将它们设置为 false以禁用任何默认缓存组。
    a. priority:一个模块可以属于多个缓存组。优化将优先考虑具有更高 priority（优先级）的缓存组。默认组的优先级为负，以允许自定义组获得更高的优先级（自定义组的默认值为 0）
    b. test:控制此缓存组选择的模块。省略它会选择所有模块。它可以匹配绝对模块资源路径或 chunk 名称。匹配 chunk 名称时，将选择 chunk 中的所有模块
    c. reuseExistingChunk: 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。这可能会影响 chunk 的结果文件名。
