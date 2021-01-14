<template>

  <CoreMenuOption
    :label="exploreString('exploreLabel')"
    :link="url"
    icon="search"
  />

</template>


<script>

  import CoreMenuOption from 'kolibri.coreVue.components.CoreMenuOption';
  import navComponents from 'kolibri.utils.navComponents';
  import urls from 'kolibri.urls';
  import commonExploreStrings from './commonExploreStrings';

  const component = {
    name: 'ExploreSideNavEntry',
    mixins: [commonExploreStrings],
    components: {
      CoreMenuOption,
    },
    $trs: {},
    computed: {
      url() {
        return urls['kolibri:kolibri_explore_plugin:explore']();
      },
    },
    priority: 5,
  };

  navComponents.register(component);

  export default component;

</script>
