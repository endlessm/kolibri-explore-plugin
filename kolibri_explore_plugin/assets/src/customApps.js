import urls from 'kolibri.urls';

// List of channel ids and the app name with the corresponding
// custom-channel-presentation zip bundle
export const CustomChannelApps = {
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids',
  '3e464ee12f6a50a781cddf59147b48b1': 'sikana',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind',
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
  'healthy-body',
  'healthy-mind',
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
