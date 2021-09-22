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

export function goToContent(node) {
  console.debug(`Go to: ${node.title}`);
  window.kolibri.navigateTo(node.id);
}
