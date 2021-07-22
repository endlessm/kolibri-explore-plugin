// Communication with Kolibri frontend:

export function getThumbnail(node) {
  return new Promise((resolve) => {
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

export function askChannelInformation(callback, allNodes = true) {
  window.addEventListener('message', (event) => {
    // console.log(event);
    if (event.data.event && event.data.nameSpace === 'hashi'
              && event.data.event === 'sendChannelInformation') {
      callback(event.data.data);
    }
  });

  const nameSpace = 'customChannelPresentation';
  const event = 'askChannelInformation';
  const data = { allNodes };
  const message = {
    event,
    data,
    nameSpace,
  };
  window.parent.postMessage(message, '*');
}

export function fetchCollection(callback, getParams) {
  window.addEventListener('message', (event) => {
    if (event.data.event && event.data.nameSpace === 'hashi'
              && event.data.event === 'sendCollection') {
      callback(event.data.data);
    }
  });

  const nameSpace = 'customChannelPresentation';
  const event = 'fetchCollection';
  const data = { getParams };
  const message = {
    event,
    data,
    nameSpace,
  };
  window.parent.postMessage(message, '*');
}
