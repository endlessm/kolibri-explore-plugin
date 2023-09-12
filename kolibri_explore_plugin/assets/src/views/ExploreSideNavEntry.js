import navComponents from 'kolibri.utils.navComponents';
import urls from 'kolibri.urls';
import baseRoutes from '../routes/baseRoutes';
import { exploreStrings } from './commonExploreStrings';

const sideNavConfig = {
  name: 'ExploreSideNavEntry',
  get url() {
    return urls['kolibri:kolibri_explore_plugin:explore']();
  },
  get routes() {
    return [
      {
        label: exploreStrings.$tr('discoveryLabel'),
        icon: 'dashboard',
        route: baseRoutes.topicsRoot.path,
        name: baseRoutes.topicsRoot.name,
      },
      {
        label: exploreStrings.$tr('libraryLabel'),
        icon: 'magnify',
        route: baseRoutes.search.path,
        name: baseRoutes.search.name,
      },
    ];
  },
  get label() {
    return exploreStrings.$tr('exploreLabel');
  },
  icon: 'dashboard',
  priority: 10,
  bottomBar: true,
};

navComponents.register(sideNavConfig);

export default sideNavConfig;
