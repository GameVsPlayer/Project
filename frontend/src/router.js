import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function lazyLoad(view) {
  return () => import(`@/views/${view}.vue`)
}



const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'is-active',
  routes: [{
      path: '/',
      name: 'home',
      component: lazyLoad('Home'),
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/commands',
      name: 'commands',
      component: lazyLoad('Commands'),
      meta: {
        title: 'Commands',
      }
    },
    {
      path: '/langs',
      name: 'languages',
      component: lazyLoad('Languages'),
      meta: {
        title: 'Languages'
      }
    },
    {
      path: '/stats',
      name: 'stats',
      component: lazyLoad('Stats'),
      meta: {
        title: 'Stats'
      }
    },
    {
      path: '/inv',
      name: 'invite',
      component: lazyLoad('Invite'),
      meta: {
        title: 'Invite'
      }
    },
    {
      path: '/social',
      name: 'Social',
      component: lazyLoad('Social'),
      meta: {
        title: 'Social'
      }
    },
    {
      path: '/imprint',
      name: 'Imprint',
      component: lazyLoad('Imprint'),
      meta: {
        title: 'Imprint'
      }
    },
    {
      path: '/ServerStats',
      name: 'ServerStats',
      component: lazyLoad('Server'),
      meta: {
        title: 'ServerStats'
      }
    },
    {
      path: '/Todo',
      name: 'Todolist',
      component: lazyLoad('Todo'),
      meta: {
        title: 'Todolist'
      }
    },
    {
      path: '*',
      component: lazyLoad('PageNotFound'),
      meta: {
        title: 'Page Not Found!'
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title + " | Gamu.tk" : 'Gamu.tk';
  next();
});


export default router;