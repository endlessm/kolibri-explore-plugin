import urls from 'kolibri.urls';
import { utils } from 'eos-components';

// List of channel ids and the app name with the corresponding
// custom-channel-presentation zip bundle
export const CustomChannelApps = {
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids',
  '3e464ee12f6a50a781cddf59147b48b1': 'sikana-english',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind',
  '3160899a73564d8a8467284d9219b91c': 'terminal-two',
  '057f871caa405ec29d62ba0523c193d7': 'music',
  efcc464be5a85ba5a58d1636b00313fc: 'gardening',
  f62db29be20453c4a267132e93a9e602: 'wikipedia',
  '85b42a40745f4e2392ed62e72d4dad6e': 'oceanx',
  e409b964366a59219c148f2aaa741f43: 'blockly-games',
  '197934f144305350b5820c7c4dd8e194': 'phet-interactive-simulations',
  bbb4ea407a3c450cb18cbaa76f2d75cd: 'cspathshala-english',
  fc47aee82e0153e2a30197d3fdee1128: 'open-stax',
  '74f36493bb475b62935fa8705ed59fed': 'thoughtful-learning',
  '1e378725d3924b47aa5e1260628820b5': 'ted-ed-lessons',
  '922e9c576c2f59e59389142b136308ff': 'career-girls',
};

export function getAppNameByID(id) {
  return CustomChannelApps[id] || 'default';
}

// This should match a file existing on static/thumbnails/NAME.jpg
export const ThumbApps = [
  'ted-ed-lessons',
  // 'dance',
  'terminal-two',
  'music',
  'wikipedia', // FIXME replace thumbnail.
  'career-girls',
  'gardening',
  'healthy-body',
  '49ers-edu-digital-playbook',
  // 'financial-education',
  // 'reading',
  'oceanx',
  // 'stem',
  'common-sense-student-resources',
  'pbs-kids',
  'touchable-earth',
  'healthy-mind',
  'khan-academy',
  'techbridge-girls-home',
  'blockly-games',
  'sikana-english',
  'cspathshala-english',
  'open-stax',
  'phet-interactive-simulations',
];

export const GameAppIDs = [
  '3160899a73564d8a8467284d9219b91c', // Terminal Two
];

export function getBigThumbnail(channel) {
  if (!channel.title) {
    return null;
  }

  const normalName = utils.getSlug(channel.title);
  if (ThumbApps.includes(normalName)) {
    return urls.static(`thumbnails/${normalName}.jpg`);
  }

  return null;
}
