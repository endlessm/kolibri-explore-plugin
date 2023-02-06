export const store = {
  state: {
    isUsbConnected: false,
    needsPermission: false,
  },
  setUsbConnected (isUsbConnected) {
    this.state.isUsbConnected = isUsbConnected;
  },
  setNeedsPermission (needsPermission) {
    this.state.needsPermission = needsPermission;
  },
};
