import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
// import VideosList from '../views/VideosList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // {
  //   path: '/:section/:subsection',
  //   name: 'VideosList',
  //   component: VideosList,
  // },
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
