import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    // Inspired by https://levelup.gitconnected.com/managing-wildcard-subdomains-with-vue-router-9fd74518f2f5
    if (!location) throw new Error('No access to `location`!');
    const subDir = location.host.split('.')[0];
    const domains = ['price-calc', 'www', 'localhost:8080', 'localhost:5000', 'dev--price-calc'];
    const subDomains = ['hourly', 'project', 'value'];

    const noSubDomainTarget = !subDomains.includes(to.name) || subDir !== to.name;
    if (!domains.includes(subDir) && noSubDomainTarget) {
      next({ name: subDir, params: {} });
    } else next();
  });

  return Router;
}
