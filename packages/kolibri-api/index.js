// Communication with Kolibri frontend:

export function getThumbnail(node) {
  return new Promise((resolve, reject) => {
    if (!window.frameElement) {
      reject(new Error('Not an iframe window'));
    }
    window.addEventListener('message', function waitThumb(event) {
      if (event.data.event && event.data.nameSpace === 'hashi'
                && event.data.event === 'sendThumbnail'
                && event.data.data.id === node.id) {
        window.removeEventListener('message', waitThumb, false);
        resolve(event.data.data.thumbnail);
      }
    }, false);

    const nameSpace = 'customChannelPresentation';
    const event = 'getThumbnail';
    const data = node.id;
    const message = {
      event,
      data,
      nameSpace,
    };
    window.parent.postMessage(message, '*');
  });
}

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
