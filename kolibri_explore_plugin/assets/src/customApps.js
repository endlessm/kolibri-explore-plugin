import urls from 'kolibri.urls';

// List of channel ids and the app name with the corresponding
// custom-channel-presentation zip bundle
export const CustomChannelApps = {
  e409b964366a59219c148f2aaa741f43: 'blockly-games',
  bbb4ea407a3c450cb18cbaa76f2d75cd: 'cspathshala-english',
  c9d7f950ab6b5a1199e3d6c10d7f0103: 'khan-academy',
  '85b42a40745f4e2392ed62e72d4dad6e': 'oceanx',
  fc47aee82e0153e2a30197d3fdee1128: 'open-stax',
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids',
  '197934f144305350b5820c7c4dd8e194': 'phet-interactive-simulations',
  e9d0d54d209344849e9bed0aa8c222ad: 'sikana-diy',
  '9c33eb395508447d96c96682cb18c57a': 'techbridge-girls-home',
  '2091ca47ff544c96b4ae02b3a92346e1': 'ted-ed-lessons',
  '3160899a73564d8a8467284d9219b91c': 'terminal-two',
  '74f36493bb475b62935fa8705ed59fed': 'thoughtful-learning',
  bf0260ed911f44cda27a263db93a8512: '49ers-edu-digital-playbook',
  // Endless curated content (mostly Youtube content based)
  f061fce103ff5d4e9b8433e67802e666: 'arts',
  '4968191fba07548c9592fc174a70b5d6': 'beauty',
  '79a50be66bad5eb686c42617c914fd45': 'careers',
  '79cd09863eed51e98576c35ede6f9c9d': 'cooking',
  e11462f71c6f5472b113311c69071b05: 'dance',
  bf36d8e7e1ee56b194fe52cafbfd9db3: 'fashion',
  '2b43973f53f1538bad5ece63ad847606': 'financial-literacy',
  '57e23812e0dc562581958e39acedd717': 'gaming',
  efcc464be5a85ba5a58d1636b00313fc: 'gardening',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind',
  b40491d1ef8b5506b8c6ae861372e9de: 'jewelry-making',
  '9eeebbc5140d5b98ac4a4d2ce9432135': 'lgbtq',
  '057f871caa405ec29d62ba0523c193d7': 'music',
  '95a1ceaec2b849ed90fe0b135791b163': 'novels',
  '59bb2e5a3d2e5e3b85b87d9ab4daa2f3': 'reading',
  '3fcffebc58d15175b948b140434ef6e6': 'sports',
  '92e96efc082e5c62b0aac3847bdcdb33': 'staff-playlist',
  '2f95235c3709511fa12d007f31ed6a7b': 'steam',
  '1520f018610256549c98ca0140cceebe': 'virtual-field-trips',
  // Zim file based channels
  f62db29be20453c4a267132e93a9e602: 'wikipedia',
  '35ec8e78266d545b9449af6e2409b10d': 'wikihow',
  '58828121cc115549bda7fb3f71f4795e': 'wikihow-arts-and-entertainment',
  '05a4060cf5175df78edec8dc09e396a1': 'wikihow-cars-and-other-vehicles',
  '69497db42937539e94fe3969f6995d2d': 'wikihow-computers-and-electronics',
  '00b0d8dff13e518d801ef816227b2691': 'wikihow-education-and-communications',
  b9fe8fe9b92b5af5964feccdadb78413: 'wikihow-food-and-entertaining',
  e114fe9de66e513384e4ca2e9b529c18: 'wikihow-hobbies-and-crafts',
  '9c494b7b879e512f96f60176df85968c': 'wikihow-holidays-and-traditions',
  '304d529d4b1c597ea7d3c59b30ac3c14': 'wikihow-home-and-garden',
  afbf0498da3c5db3947c291ddda8e21a: 'wikihow-personal-care-and-style',
  '146efed5aa585229a49513219e73af66': 'wikihow-sports-and-fitness',
  e4e4d0e342f951b09aa9ef1622f5301f: 'wikihow-work-world',
  '6f6dd2720bd2574fa70a069ac9b75046': 'wikihow-youth',
};

export function getAppNameByID(id) {
  return CustomChannelApps[id] || 'default';
}

// The order here is important because is how they appear in the channel page.
export const RecommendedChannelIDs = [
  '2091ca47ff544c96b4ae02b3a92346e1', // ted-ed-lessons
  'e11462f71c6f5472b113311c69071b05', // dance
  'bf0260ed911f44cda27a263db93a8512', // 49ers-edu-digital-playbook
  '057f871caa405ec29d62ba0523c193d7', // music
  'f62db29be20453c4a267132e93a9e602', // wikipedia
  '9c33eb395508447d96c96682cb18c57a', // techbridge-girls-home
  '3160899a73564d8a8467284d9219b91c', // terminal-two
  'efcc464be5a85ba5a58d1636b00313fc', // gardening
  'f5f6729f95b55753badeaa066fa6e986', // healthy-body
  '2b43973f53f1538bad5ece63ad847606', // financial-literacy
  '59bb2e5a3d2e5e3b85b87d9ab4daa2f3', // reading
  '85b42a40745f4e2392ed62e72d4dad6e', // oceanx
  'f061fce103ff5d4e9b8433e67802e666', // arts
  'c9d7f950ab6b5a1199e3d6c10d7f0103', // khan-academy
  '38eaaf9ec82a44f9ab6e7a44cb730f07', // pbs-kids
  '000409f81dbe5d1ba67101cb9fed4530', // touchable-earth
  '4e413158eac55422a5343af9fcfa8d59', // healthy-mind
  '97111903de564de49483a9705d41a8ac', // career-girls
  'bcc6e12a0ddf4a17a8b600c6b880e3ed', // common-sense-student-resources
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
  c8540424d77f44f8ae306e22d3b14eaf: 'coronavirus.jpg',
  '2091ca47ff544c96b4ae02b3a92346e1': 'ted-ed-lessons.jpg',
  '74f36493bb475b62935fa8705ed59fed': 'thoughtful-learning.jpg',
  '0418cc231e9c5513af0fff9f227f7172': 'hello-channel.jpg',
  '3160899a73564d8a8467284d9219b91c': 'terminal-two.jpg',
  '97111903de564de49483a9705d41a8ac': 'career-girls.jpg',
  bf0260ed911f44cda27a263db93a8512: '49ers-edu-digital-playbook.jpg',
  '85b42a40745f4e2392ed62e72d4dad6e': 'oceanx.jpg',
  bcc6e12a0ddf4a17a8b600c6b880e3ed: 'common-sense-student-resources.jpg',
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids.jpg',
  '000409f81dbe5d1ba67101cb9fed4530': 'touchable-earth.jpg',
  c9d7f950ab6b5a1199e3d6c10d7f0103: 'khan-academy.jpg',
  '9c33eb395508447d96c96682cb18c57a': 'techbridge-girls-home.jpg',
  e409b964366a59219c148f2aaa741f43: 'blockly-games.jpg',
  e9d0d54d209344849e9bed0aa8c222ad: 'sikana-diy.jpg',
  bbb4ea407a3c450cb18cbaa76f2d75cd: 'cspathshala-english.jpg',
  '3c77d9dd717341bb8fff8da6ab980df3': 'mother-goose-club.jpg',
  fc47aee82e0153e2a30197d3fdee1128: 'open-stax.jpg',
  '197934f144305350b5820c7c4dd8e194': 'phet-interactive-simulations.jpg',
  // Endless curated content (mostly Youtube content based)
  f061fce103ff5d4e9b8433e67802e666: 'arts.jpg',
  '4968191fba07548c9592fc174a70b5d6': 'beauty.jpg',
  '79a50be66bad5eb686c42617c914fd45': 'careers.jpg',
  '79cd09863eed51e98576c35ede6f9c9d': 'cooking.jpg',
  e11462f71c6f5472b113311c69071b05: 'dance.jpg',
  bf36d8e7e1ee56b194fe52cafbfd9db3: 'fashion.jpg',
  '2b43973f53f1538bad5ece63ad847606': 'financial-literacy.jpg',
  '57e23812e0dc562581958e39acedd717': 'gaming.jpg',
  efcc464be5a85ba5a58d1636b00313fc: 'gardening.jpg',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body.jpg',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind.jpg',
  b40491d1ef8b5506b8c6ae861372e9de: 'jewelry-making.jpg',
  '9eeebbc5140d5b98ac4a4d2ce9432135': 'lgbtq.jpg',
  '057f871caa405ec29d62ba0523c193d7': 'music.jpg',
  '95a1ceaec2b849ed90fe0b135791b163': 'novels.jpg',
  '59bb2e5a3d2e5e3b85b87d9ab4daa2f3': 'reading.jpg',
  '3fcffebc58d15175b948b140434ef6e6': 'sports.jpg',
  '92e96efc082e5c62b0aac3847bdcdb33': 'staff-playlist.jpg',
  '2f95235c3709511fa12d007f31ed6a7b': 'steam.jpg',
  '1520f018610256549c98ca0140cceebe': 'virtual-field-trips.jpg',
  // Zim file based channels
  f62db29be20453c4a267132e93a9e602: 'wikipedia.jpg',
  '58828121cc115549bda7fb3f71f4795e': 'wikihow-arts-and-entertainment.jpg',
  '05a4060cf5175df78edec8dc09e396a1': 'wikihow-cars-and-other-vehicles.jpg',
  '69497db42937539e94fe3969f6995d2d': 'wikihow-computers-and-electronics.jpg',
  '00b0d8dff13e518d801ef816227b2691': 'wikihow-education-and-communications.jpg',
  b9fe8fe9b92b5af5964feccdadb78413: 'wikihow-food-and-entertaining.jpg',
  e114fe9de66e513384e4ca2e9b529c18: 'wikihow-hobbies-and-crafts.jpg',
  '9c494b7b879e512f96f60176df85968c': 'wikihow-holidays-and-traditions.jpg',
  '304d529d4b1c597ea7d3c59b30ac3c14': 'wikihow-home-and-garden.jpg',
  afbf0498da3c5db3947c291ddda8e21a: 'wikihow-personal-care-and-style.jpg',
  '146efed5aa585229a49513219e73af66': 'wikihow-sports-and-fitness.jpg',
  e4e4d0e342f951b09aa9ef1622f5301f: 'wikihow-work-world.jpg',
  '6f6dd2720bd2574fa70a069ac9b75046': 'wikihow-youth.jpg',
};

// These should match a file existing on static/icons/NAME
export const ChannelCardIcons = {
  '2091ca47ff544c96b4ae02b3a92346e1': 'ted-ed-lessons.png',
  '97111903de564de49483a9705d41a8ac': 'career-girls.png',
  bf0260ed911f44cda27a263db93a8512: '49ers-edu-digital-playbook.png',
  bcc6e12a0ddf4a17a8b600c6b880e3ed: 'common-sense-student-resources.png',
  '38eaaf9ec82a44f9ab6e7a44cb730f07': 'pbs-kids.png',
  '000409f81dbe5d1ba67101cb9fed4530': 'touchable-earth.png',
  '9c33eb395508447d96c96682cb18c57a': 'techbridge-girls-home.png',
  e409b964366a59219c148f2aaa741f43: 'blockly-games.png',
  e9d0d54d209344849e9bed0aa8c222ad: 'sikana-diy.png',
  c8540424d77f44f8ae306e22d3b14eaf: 'coronavirus.png',
  '3c77d9dd717341bb8fff8da6ab980df3': 'mother-goose-club.png',
  // Endless curated content (mostly Youtube content based)
  f061fce103ff5d4e9b8433e67802e666: 'arts.png',
  '4968191fba07548c9592fc174a70b5d6': 'beauty.png',
  '79a50be66bad5eb686c42617c914fd45': 'careers.png',
  '79cd09863eed51e98576c35ede6f9c9d': 'cooking.png',
  e11462f71c6f5472b113311c69071b05: 'dance.png',
  bf36d8e7e1ee56b194fe52cafbfd9db3: 'fashion.png',
  '2b43973f53f1538bad5ece63ad847606': 'financial-literacy.png',
  '57e23812e0dc562581958e39acedd717': 'gaming.png',
  efcc464be5a85ba5a58d1636b00313fc: 'gardening.png',
  f5f6729f95b55753badeaa066fa6e986: 'healthy-body.png',
  '4e413158eac55422a5343af9fcfa8d59': 'healthy-mind.png',
  b40491d1ef8b5506b8c6ae861372e9de: 'jewelry-making.png',
  '9eeebbc5140d5b98ac4a4d2ce9432135': 'lgbtq.png',
  '057f871caa405ec29d62ba0523c193d7': 'music.png',
  '95a1ceaec2b849ed90fe0b135791b163': 'novels.png',
  '59bb2e5a3d2e5e3b85b87d9ab4daa2f3': 'reading.png',
  '3fcffebc58d15175b948b140434ef6e6': 'sports.png',
  '92e96efc082e5c62b0aac3847bdcdb33': 'staff-playlist.png',
  '2f95235c3709511fa12d007f31ed6a7b': 'steam.png',
  '1520f018610256549c98ca0140cceebe': 'virtual-field-trips.png',
  // Zim file based channels
  f62db29be20453c4a267132e93a9e602: 'wikipedia.png',
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
