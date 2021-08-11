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
  console.log(`Go to: ${node.title}`);
  const nameSpace = 'customChannelPresentation';
  const event = 'goToContent';
  const data = node.id;
  const message = {
    event,
    data,
    nameSpace,
  };
  window.parent.postMessage(message, '*');
}

export function askChannelInformation(callback) {
  window.addEventListener('message', (event) => {
    if (event.data.event && event.data.nameSpace === 'hashi'
              && event.data.event === 'sendChannelInformation') {
      callback(event.data.data);
    }
  });

  const nameSpace = 'customChannelPresentation';
  const event = 'askChannelInformation';
  const data = null;
  const message = {
    event,
    data,
    nameSpace,
  };
  window.parent.postMessage(message, '*');
}

export function askNodes(callback) {
  window.addEventListener('message', (event) => {
    if (event.data.event && event.data.nameSpace === 'hashi'
              && event.data.event === 'sendNodes') {
      callback(event.data.data);
    }
  });

  const nameSpace = 'customChannelPresentation';
  const event = 'askNodes';
  const data = null;
  const message = {
    event,
    data,
    nameSpace,
  };
  window.parent.postMessage(message, '*');
}

export function trackEvent(category, action, name = '') {
  const nameSpace = 'customChannelPresentation';
  const event = 'trackEvent';
  const data = { category, action, name };
  const message = {
    event,
    data,
    nameSpace,
  };
  window.parent.postMessage(message, '*');
}
