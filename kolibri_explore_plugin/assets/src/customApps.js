import urls from 'kolibri.urls';

// List of channel ids and the app name with the corresponding
// custom-channel-presentation zip bundle
export const CustomChannelApps = {
  '1306b5d7d1ce4b98b0039324f368ce6a': 'pbskids',
  '3e464ee12f6a50a781cddf59147b48b1': 'sikana',
  '85461059d7d158f7ac03d050ddbf734e': 'healthy-living',
};

export function getAppNameByID(id) {
  return CustomChannelApps[id] || 'default';
}

// This should match a file existing on static/thumbnails/NAME.jpg
export const ThumbApps = [
  'music',
  'ted-ed-lessons',
  'common-sense-student-resources',
  'carreer-girls',
  'cspathshala',
  'touchable-earth',
  'oceanx',
  'phet-interactive-simulations',
  'khan-academy',
  'open-stax',
  'pbs-kids',
  'healthy-living',
];

export function getBigThumbnail(channel) {
  if (!channel.title) {
    return null;
  }

  const normalName = channel.title
    .toLowerCase()
    .replaceAll(/\(.*\)/g, '')
    .trim()
    .replaceAll(' ', '-');

  if (ThumbApps.includes(normalName)) {
    return urls.static(`thumbnails/${normalName}.jpg`);
  }

  return null;
}
