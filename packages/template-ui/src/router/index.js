import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import Section from '@/views/Section.vue';
import Content from '@/views/Content.vue';
import Test from '@/views/Test.vue';

import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      const { defaultContentNode } = store.state;
      if (defaultContentNode) {
        next({
          name: 'Content',
          params: { contentId: defaultContentNode },
          replace: true,
        });
      } else if (to.query.clearFilters) {
        store.commit('filters/clearFilterQuery', {});
        next({
          name: 'Home',
          query: {},
          replace: true,
        });
      } else {
        next();
      }
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    beforeEnter(to, from, next) {
      if (from.name === 'Home') {
        // Clean the search query when coming from home
        store.commit('setSearchQuery', '');
      }
      next();
    },
  },
  {
    path: '/t/:topicId',
    name: 'Section',
    component: Section,
  },
  {
    path: '/c/:contentId',
    name: 'Content',
    component: Content,
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior(to) {
    if (!to.hash) {
      return { x: 0, y: 0 };
    }
    return {
      selector: to.hash,
      offset: { x: 0, y: 15 },
    };
  },
});

export default router;
