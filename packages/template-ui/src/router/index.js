import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Search from '@/views/Search.vue';
import Section from '@/views/Section.vue';
import Content from '@/views/Content.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
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
