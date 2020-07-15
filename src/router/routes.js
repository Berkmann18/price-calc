const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/hourly', name: 'hourly', component: () => import('pages/Hourly.vue') },
      { path: '/project', name: 'project', component: () => import('pages/Project.vue') },
      { path: '/value', name: 'value', component: () => import('pages/Value.vue') }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  });
}

export default routes;
