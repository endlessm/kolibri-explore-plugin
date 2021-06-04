module.exports = {
  publicPath: './',
  transpileDependencies: ['vue-clamp', 'resize-detector'],
  css: {
    // FIXME this is because of IE11 compatibility:
    extract: false,
  },
  chainWebpack: (config) => {
    ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(rule => {
      config.module.rule('scss')
        .oneOf(rule)
        .use('resolve-url-loader')
        .loader('resolve-url-loader')
        .before('sass-loader')
        .end()
        .use('sass-loader')
        .loader('sass-loader')
        .tap(options =>
          ({...options, sourceMap: true})
        );
    });
  },
};
