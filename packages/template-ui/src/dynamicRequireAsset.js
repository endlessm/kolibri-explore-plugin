export default function (assetFileName) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`@/overrides/assets/${assetFileName}`);
  } catch (e) {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return require(`@/assets/${assetFileName}`);
    } catch (e2) {
      return null;
    }
  }
}
