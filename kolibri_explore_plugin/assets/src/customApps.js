import urls from 'kolibri.urls';

// List of channel ids and the app name with the corresponding
// custom-channel-presentation zip bundle
export const CustomChannelApps = {
  e409b964366a59219c148f2aaa741f43: 'blockly-games',
  bbb4ea407a3c450cb18cbaa76f2d75cd: 'cspathshala-english',
  '85b42a40745f4e2392ed62e72d4dad6e': 'oceanx',
  fc47aee82e0153e2a30197d3fdee1128: 'open-stax',
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids',
  '197934f144305350b5820c7c4dd8e194': 'phet-interactive-simulations',
  e9d0d54d209344849e9bed0aa8c222ad: 'sikana-diy',
  '2091ca47ff544c96b4ae02b3a92346e1': 'ted-ed-lessons',
  '3160899a73564d8a8467284d9219b91c': 'terminal-two',
  '74f36493bb475b62935fa8705ed59fed': 'thoughtful-learning',
  f62db29be20453c4a267132e93a9e602: 'wikipedia',
  f061fce103ff5d4e9b8433e67802e666: 'arts',
  c9d7f950ab6b5a1199e3d6c10d7f0103: 'khan-academy',
  '79a50be66bad5eb686c42617c914fd45': 'careers',
  '79cd09863eed51e98576c35ede6f9c9d': 'cooking',
  e11462f71c6f5472b113311c69071b05: 'dance',
  '2b43973f53f1538bad5ece63ad847606': 'financial-literacy',
  '57e23812e0dc562581958e39acedd717': 'gaming',
  efcc464be5a85ba5a58d1636b00313fc: 'gardening',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind',
  '057f871caa405ec29d62ba0523c193d7': 'music',
  '59bb2e5a3d2e5e3b85b87d9ab4daa2f3': 'reading',
  '3fcffebc58d15175b948b140434ef6e6': 'sports',
  '2f95235c3709511fa12d007f31ed6a7b': 'steam',
  e5b26962b0ee5d8487152d0987d32e44: '49ers-edu-digital-playbook',
  '1e755450dede5c40af1487e07984c260': 'techbridge-girls-home',
  '97111903de564de49483a9705d41a8ac': 'career-girls',
  bcc6e12a0ddf4a17a8b600c6b880e3ed: 'common-sense-student-resources',
};

export function getAppNameByID(id) {
  return CustomChannelApps[id] || 'default';
}

// The order here is important because is how they appear in the channel page.
export const RecommendedChannelIDs = [
  '2091ca47ff544c96b4ae02b3a92346e1', // ted-ed-lessons
  'e11462f71c6f5472b113311c69071b05', // dance
  '3160899a73564d8a8467284d9219b91c', // terminal-two
  '057f871caa405ec29d62ba0523c193d7', // music
  'f62db29be20453c4a267132e93a9e602', // wikipedia
  '97111903de564de49483a9705d41a8ac', // career-girls
  'efcc464be5a85ba5a58d1636b00313fc', // gardening
  'f5f6729f95b55753badeaa066fa6e986', // healthy-body
  'e5b26962b0ee5d8487152d0987d32e44', // 49ers-edu-digital-playbook
  '2b43973f53f1538bad5ece63ad847606', // financial-literacy
  '59bb2e5a3d2e5e3b85b87d9ab4daa2f3', // reading
  '85b42a40745f4e2392ed62e72d4dad6e', // oceanx
  'f061fce103ff5d4e9b8433e67802e666', // arts
  'c9d7f950ab6b5a1199e3d6c10d7f0103', // khan-academy
  '38eaaf9ec82a44f9ab6e7a44cb730f07', // pbs-kids
  '000409f81dbe5d1ba67101cb9fed4530', // touchable-earth
  '4e413158eac55422a5343af9fcfa8d59', // healthy-mind
  'bcc6e12a0ddf4a17a8b600c6b880e3ed', // common-sense-student-resources
  '1e755450dede5c40af1487e07984c260', // techbridge-girls-home
  '2f95235c3709511fa12d007f31ed6a7b', // steam
  '79cd09863eed51e98576c35ede6f9c9d', // cooking
  '79a50be66bad5eb686c42617c914fd45', // careers
  'e409b964366a59219c148f2aaa741f43', // blockly-games
  '3fcffebc58d15175b948b140434ef6e6', // sports
  'e9d0d54d209344849e9bed0aa8c222ad', // sikana-diy
  'bbb4ea407a3c450cb18cbaa76f2d75cd', // cspathshala-english
  '57e23812e0dc562581958e39acedd717', // gaming
  'fc47aee82e0153e2a30197d3fdee1128', // open-stax
  '197934f144305350b5820c7c4dd8e194', // phet-interactive-simulations
  '74f36493bb475b62935fa8705ed59fed', // thoughtful-learning
  '0418cc231e9c5513af0fff9f227f7172', // hello-channel
  'c8540424d77f44f8ae306e22d3b14eaf', // coronavirus
  '3c77d9dd717341bb8fff8da6ab980df3', // mother-goose-club
];

// These should match a file existing on static/thumbnails/NAME
export const ChannelCardThumbnails = {
  '2091ca47ff544c96b4ae02b3a92346e1': 'ted-ed-lessons.jpg',
  e11462f71c6f5472b113311c69071b05: 'dance.jpg',
  '3160899a73564d8a8467284d9219b91c': 'terminal-two.jpg',
  '057f871caa405ec29d62ba0523c193d7': 'music.jpg',
  f62db29be20453c4a267132e93a9e602: 'wikipedia.jpg',
  '97111903de564de49483a9705d41a8ac': 'career-girls.jpg',
  efcc464be5a85ba5a58d1636b00313fc: 'gardening.jpg',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body.jpg',
  e5b26962b0ee5d8487152d0987d32e44: '49ers-edu-digital-playbook.jpg',
  '2b43973f53f1538bad5ece63ad847606': 'financial-literacy.jpg',
  '59bb2e5a3d2e5e3b85b87d9ab4daa2f3': 'reading.jpg',
  '85b42a40745f4e2392ed62e72d4dad6e': 'oceanx.jpg',
  '2f95235c3709511fa12d007f31ed6a7b': 'steam.jpg',
  bcc6e12a0ddf4a17a8b600c6b880e3ed: 'common-sense-student-resources.jpg',
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids.jpg',
  '000409f81dbe5d1ba67101cb9fed4530': 'touchable-earth.jpg',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind.jpg',
  c9d7f950ab6b5a1199e3d6c10d7f0103: 'khan-academy.jpg',
  '1e755450dede5c40af1487e07984c260': 'techbridge-girls-home.jpg',
  e409b964366a59219c148f2aaa741f43: 'blockly-games.jpg',
  e9d0d54d209344849e9bed0aa8c222ad: 'sikana-diy.jpg',
  bbb4ea407a3c450cb18cbaa76f2d75cd: 'cspathshala-english.jpg',
  fc47aee82e0153e2a30197d3fdee1128: 'open-stax.jpg',
  '197934f144305350b5820c7c4dd8e194': 'phet-interactive-simulations.jpg',
  f061fce103ff5d4e9b8433e67802e666: 'arts.jpg',
  '79a50be66bad5eb686c42617c914fd45': 'careers.jpg',
  '79cd09863eed51e98576c35ede6f9c9d': 'cooking.jpg',
  '57e23812e0dc562581958e39acedd717': 'gaming.jpg',
  '3fcffebc58d15175b948b140434ef6e6': 'sports.jpg',
  '74f36493bb475b62935fa8705ed59fed': 'thoughtful-learning.jpg',
  '0418cc231e9c5513af0fff9f227f7172': 'hello-channel.jpg',
  c8540424d77f44f8ae306e22d3b14eaf: 'coronavirus.jpg',
  '3c77d9dd717341bb8fff8da6ab980df3': 'mother-goose-club.jpg',
};

// These should match a file existing on static/icons/NAME
export const ChannelCardIcons = {
  '2091ca47ff544c96b4ae02b3a92346e1': 'ted-ed-lessons.png',
  e11462f71c6f5472b113311c69071b05: 'dance.png',
  '057f871caa405ec29d62ba0523c193d7': 'music.png',
  f62db29be20453c4a267132e93a9e602: 'wikipedia.png',
  '97111903de564de49483a9705d41a8ac': 'career-girls.png',
  efcc464be5a85ba5a58d1636b00313fc: 'gardening.png',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body.png',
  e5b26962b0ee5d8487152d0987d32e44: '49ers-edu-digital-playbook.png',
  '2b43973f53f1538bad5ece63ad847606': 'financial-literacy.png',
  '59bb2e5a3d2e5e3b85b87d9ab4daa2f3': 'reading.png',
  '2f95235c3709511fa12d007f31ed6a7b': 'steam.png',
  bcc6e12a0ddf4a17a8b600c6b880e3ed: 'common-sense-student-resources.png',
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids.png',
  '000409f81dbe5d1ba67101cb9fed4530': 'touchable-earth.png',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind.png',
  '1e755450dede5c40af1487e07984c260': 'techbridge-girls-home.png',
  e409b964366a59219c148f2aaa741f43: 'blockly-games.png',
  e9d0d54d209344849e9bed0aa8c222ad: 'sikana-diy.png',
  f061fce103ff5d4e9b8433e67802e666: 'arts.png',
  '79a50be66bad5eb686c42617c914fd45': 'careers.png',
  '79cd09863eed51e98576c35ede6f9c9d': 'cooking.png',
  '57e23812e0dc562581958e39acedd717': 'gaming.png',
  '3fcffebc58d15175b948b140434ef6e6': 'sports.png',
  c8540424d77f44f8ae306e22d3b14eaf: 'coronavirus.png',
  '3c77d9dd717341bb8fff8da6ab980df3': 'mother-goose-club.png',
};

export const GameAppIDs = [
  '3160899a73564d8a8467284d9219b91c', // Terminal Two
];

export function getBigThumbnail(channel) {
  if (channel.id in ChannelCardThumbnails) {
    return urls.static(`thumbnails/${ChannelCardThumbnails[channel.id]}`);
  }
  return null;
}

export function getChannelIcon(channel) {
  if (channel.id in ChannelCardIcons) {
    return urls.static(`icons/${ChannelCardIcons[channel.id]}`);
  }
  return channel.thumbnail;
}
