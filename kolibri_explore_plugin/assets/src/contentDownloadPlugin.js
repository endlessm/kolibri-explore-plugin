import {
  checkContentDownload,
  startContentDownload,
  retryContentDownload,
} from './modules/manageContent/handlers';

const ContentDownloadPlugin = {
  install(Vue) {
    Vue.prototype.$download = {
      check: checkContentDownload,
      start: startContentDownload,
      retry: retryContentDownload,
    };
  },
};

export default ContentDownloadPlugin;
