export default function (assetFileName) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`@/overrides/assets/${assetFileName}`);
  } catch {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return require(`@/assets/${assetFileName}`);
    } catch {
      return null;
    }
  }
}
