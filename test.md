# 什么是SplitChunks

Splitchunks是webpack的一个功能，用于优化打包后的文件大小，特别是对于多页面应用时可以将公共的代码打包成一个独立的chunk，从而避免重复加载，提升加载速度。

# 默认值



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

# 特点

*   1.通过optimization.splitChunks.minSize参数可以设置模块的最小大小，只有大于该数值的模块才会被提取。
*   2.optimization.splitChunks.chunks参数控制对哪些模块进行处理，有三个可选方案：  all - 提取所有模块中的公共代码。 async - 只提取异步加载的模块公共代码。 initial - 只提取同步加载的模块公共代码。
*   3.通过maxInitialRequests、maxAsyncRequests参数限制异步加载模块分别最多分离出多少个chunk。 &#x20;
*   4.同构应用需要设置optimization.splitChunks.name，此选项尤其重要，它可以避免由于缺失 chunk 名导致相同 chunk 被重复引入。
*   &#x20;5.splitChunks.cacheGroups 缓存组可以继承和/或覆盖来自 splitChunks.\* 的任何选项。但是 test、priority 和 reuseExistingChunk 只能在缓存组级别上进行配置。将它们设置为 false以禁用任何默认缓存组。    &#x20;

    *   a. priority:一个模块可以属于多个缓存组。优化将优先考虑具有更高 priority（优先级）的缓存组。默认组的优先级为负，以允许自定义组获得更高的优先级（自定义组的默认值为 0）   &#x20;
    *   &#x20;b. test:控制此缓存组选择的模块。省略它会选择所有模块。它可以匹配绝对模块资源路径或 chunk 名称。匹配 chunk 名称时，将选择 chunk 中的所有模块    &#x20;
    *   c. reuseExistingChunk: 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。这可能会影响 chunk 的结果文件名。

# 用法
// main.js

```js
import b from './testB';
console.log('main',b);
```

// testA.js

```js
import b from './testB';
console.log('main',b);
```

// testB.js

```js
import b from './testB';
console.log('main',b);
```

// testC.js

```js
console.log('testC');
export default 'testC';
```


// testF.js

```js
import b from './testB';
import c from './testC';
import { isEmpty } from 'lodash';
if(isEmpty("")) {
    console.log('iftestF', b, c);
}else{
    console.log('elsetestF', b, c);
}
// console.log('testF', b, c);
export default 'testF';
```

## 依赖关系如下图

splitchunk.jpg![splitchunk.jpg](https://upload-images.jianshu.io/upload_images/16627522-b5f5edbb729dd311.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 使用默认值打包后的样子

default.jpg![default.jpg](https://upload-images.jianshu.io/upload_images/16627522-77fb54fac7ecd122.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


可以看出 每一个html对应一个 js 从上面的依赖关系可以看出 3个页面之间是有公用的代码的。如果能把公用的代码抽离出来会更好，
现在是每个一页面对应的js包含所以来的所有代码，也就是说 main.js,testA.js,testF.js都包含testB这个模块的代码,如下图

contain.jpg![contain.jpg](https://upload-images.jianshu.io/upload_images/16627522-69973efaa0c52494.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


问题1 怎么把公共代码提取出来作为一个单独的js呢？ 如下图

抽取公共代码.jpg![抽取公共代码.jpg](https://upload-images.jianshu.io/upload_images/16627522-cc9fb1e56015a105.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


只需要把chunks:async => chunks:all  （all - 提取所有模块中的公共代码。 async - 只提取异步加载的模块公共代码。 initial - 只提取同步加载的模块公共代码）  minSize:20000=>minSize:0 (只有大于该数值的模块才会被提取) ,可以看到在defaultVendors 下新增加了一个name 有该选项后 打包出的chunk 用改名字

问题2 在多页面中，node_modules 里面的所有模块都打包到一个chunk下了，不管在具体的那一个页面都会加载全部的的公共依赖chunk-vendors，从上面的依赖关系图可以看出 lodash 只有testF.js模块在使用 ,应该只在 testF.html 加载,不应该放到
chunk-vendors里面，那么我们如何把lodash分离出来呢。如下图
lodash.png![lodash.png](https://upload-images.jianshu.io/upload_images/16627522-b187ffdcd7077422.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


图上的配置表示priority(priority:一个模块可以属于多个缓存组。优化将优先考虑具有更高 priority（优先级）的缓存组。默认组的优先级为负，以允许自定义组获得更高的优先级（自定义组的默认值为 0) 因为上面的chunk-lodash 的priority值为-5 大于另外两个的 -10和-20 所以优先执行改配置，所以 会从node_modules 里面分离出lodash.



