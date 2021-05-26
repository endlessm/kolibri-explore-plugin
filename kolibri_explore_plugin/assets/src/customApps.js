// List of channel ids and the app name with the corresponding
// custom-channel-presentation zip bundle
export const CustomChannelApps = {
  '1306b5d7d1ce4b98b0039324f368ce6a': 'pbskids',
  '3e464ee12f6a50a781cddf59147b48b1': 'sikana',
  '85461059d7d158f7ac03d050ddbf734e': 'healthy-living',
  d3faf4e0feea4dd8b93d47e12081231f: 'teded-think-like-a-coder',
};

export function getAppNameByID(id) {
  return CustomChannelApps[id] || 'default';
}
