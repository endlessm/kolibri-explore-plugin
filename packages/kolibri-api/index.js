// Communication with Kolibri frontend:

export function goToChannelList() {
  console.log('Go to channel list');
  const nameSpace = 'customChannelPresentation';
  const event = 'goToChannelList';
  const data = {};
  const message = {
    event,
    data,
    nameSpace,
  };
  window.parent.postMessage(message, '*');
}
