export default {
  data() {
    return {
      isOffline: false,
    };
  },
  created() {
    this.isOffline = !navigator.onLine;
    window.addEventListener('offline', this.onOffline);
    window.addEventListener('online', this.onOnline);
  },
  destroyed() {
    window.removeEventListener('offline', this.onOffline);
    window.removeEventListener('online', this.onOnline);
  },
  methods: {
    onOffline() {
      this.isOffline = true;
    },
    onOnline() {
      this.isOffline = false;
    },
  },
};
