module.exports = {
  publicPath: './',
  transpileDependencies: ['vue-clamp', 'resize-detector'],
  css: {
    // FIXME this is because of IE11 compatibility:
    extract: false,
  },
  configureWebpack: {
    resolve: {
      alias: {
        'channel-overrides': '../../template-ui/src/overrides/styles.scss',
      },
    },
  },
};
