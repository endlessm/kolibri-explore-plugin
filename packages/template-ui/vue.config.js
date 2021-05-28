module.exports = {
  publicPath: './',
  transpileDependencies: ['vue-clamp', 'resize-detector'],
  css: {
    // FIXME this is because of IE11 compatibility:
    extract: false,
  },
};
