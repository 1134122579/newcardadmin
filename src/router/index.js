import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import userRouter from './modules/user'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: {
          roles: ["admin"],
          title: "首页",
          icon: "dashboard",
          affix: true,
        },
      },
    ],
  },

  {
    path: "/cartedcard",
    component: Layout,
    redirect: "cartedcard",
    name: "article",
    meta: {
      roles: ["admin"],
      title: "卡包管理",
      icon: "article",
    },
    children: [
      {
        path: "List",
        component: () => import("@/views/cartedcard/list"),
        name: "articleList",
        meta: {
          roles: ["admin"],
          title: "卡包列表",
          icon: "article",
        },
      },
      {
        path: "orderlist",
        component: () => import("@/views/cartedcard/orderlist"),
        name: "orderlist",
        meta: {
          roles: ["admin"],
          title: "领取记录",
          icon: "order",
        },
      },
    ],
  },
  {
    path: "/loglist",
    component: Layout,
    redirect: "list",
    name: "user",
    meta: {
      title: "操作日志",
      icon: "user",
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/loglsit/list"),
        name: "journallist",
        meta: {
          title: "操作日志",
          icon: "user",
        },
      },
    ],
  },
  {
    path: "/seting",
    component: Layout,
    redirect: "/seting",
    name: "set",
    meta: {
      roles: ["admin"],
      title: "系统设置",
      icon: "set",
    },
    children: [
      // {
      //   path: "create",
      //   component: () => import("@/views/sysseting/add"),
      //   name: "createUser",
      //   meta: {
      //     roles: ["admin"],
      //     title: "添加管理员",
      //     icon: "add",
      //   },
      // },
      {
        path: "edit",
        component: () => import("@/views/sysseting/edit"),
        name: "Edit",
        meta: {
          roles: ["admin"],
          title: "修改密码",
          icon: "edit",
        },
      },
    ],
  },

  {
    path: "*",
    redirect: "/",
    hidden: true,
  },
];
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  // {
  //     path: "*",
  //     redirect: "/404",
  //     hidden: true
  // }
];

const createRouter = () =>
  new Router({
    // require service support
    mode: "history",
    scrollBehavior: () => ({
      y: 0,
    }),
    // base: "/cardadmin", // 加上这一行 测试环境不要加
    routes: constantRoutes,
  });

const router = createRouter();
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
