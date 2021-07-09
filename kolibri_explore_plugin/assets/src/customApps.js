import urls from 'kolibri.urls';

// List of channel ids and the app name with the corresponding
// custom-channel-presentation zip bundle
export const CustomChannelApps = {
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids',
  '3e464ee12f6a50a781cddf59147b48b1': 'sikana',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind',
  '3160899a73564d8a8467284d9219b91c': 'terminal-two',
  '057f871caa405ec29d62ba0523c193d7': 'music',
  efcc464be5a85ba5a58d1636b00313fc: 'gardening',
  f62db29be20453c4a267132e93a9e602: 'wikipedia',
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
  'terminal-two',
  'gardening',
];

export const GameAppIDs = [
  '3160899a73564d8a8467284d9219b91c', // Terminal Two
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
