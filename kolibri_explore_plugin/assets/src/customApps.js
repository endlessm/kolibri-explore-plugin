// List of channel ids and the app name with the corresponding
// custom-channel-presentation zip bundle
export const CustomChannelApps = {
  '1306b5d7d1ce4b98b0039324f368ce6a': 'pbskids',
  '3e464ee12f6a50a781cddf59147b48b1': 'sikana',
  a5ab97445f4c5c2a9d0dc7669d2de10a: 'healthy-living',
};

export function getAppNameByID(id) {
  return CustomChannelApps[id] || 'default';
}
