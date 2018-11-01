import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Callback from './components/Callback.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/beta',
      name: 'beta',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Beta.vue'),
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback,
    },
    {
      path: '*',
      redirect: '/home',
    },
  ],
});
