import {createRouter, createWebHistory, NavigationGuardNext, RouteRecordRaw} from 'vue-router'
import {clearPlaceholderLoading, placeholderLoading} from '@/utils/placeholder-loading'
import {isLogin } from "@/store/user"
import usePathStore from "@/store/path"
import useWechatStore from "@/store/wechat"
import useConfigStore from "@/store/config"
import {isAdmin, isRootAdmin} from "@/store/admin"

export const redirect = "redirect"

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/shop/home'
  },
  {
    path: '/shop',
    component: () => import('@/views/shop.vue'),
    children: [
      {
        path: '',
        redirect: "/shop/home"
      },
      {
        path: 'home',
        component: () => import('@/views/shop/home.vue'),
        meta: {
          title: '主页',
          wechat: true,
        }
      },
      {
        path: 'search',
        component: () => import('@/views/shop/search.vue'),
        meta: {
          title: '搜索',
        }
      },
      {
        path: 'wupin/list',
        redirect: "/shop/search"
      },
      {
        path: 'wupin',
        component: () => import('@/views/shop/wupin.vue'),
        meta: {
          title: '商品售卖页面',
          wechat: true,
        }
      },
      {
        path: 'wupin/record',
        component: () => import('@/views/shop/recordwupin.vue'),
        meta: {
          title: '商品售卖页面',
          wechat: true,
        }
      },
      {
        path: 'wupin/lock',
        component: () => import('@/views/shop/lockwupin.vue'),
        meta: {
          title: '商品存档页面',
          wechat: true,
        }
      },
      {
        path: 'login',
        component: () => import('@/views/shop/login.vue'),
        meta: {
          title: '登录',
          wechat: true,
        }
      },
      {
        path: 'regirster',
        component: () => import('@/views/shop/regirster.vue'),
        meta: {
          title: '注册',
          wechat: true,
        }
      },
    ],
  },
  {
    path: '/center',
    children: [
      {
        path: "",
        redirect: "/center/user",
      },
      {
        path: 'user',
        component: () => import('@/views/center/mine.vue'),
        meta: {
          title: '个人中心',
          xauth: true,
          wechat: true,
        }
      },
      {
        path: 'user/edit',
        component: () => import('@/views/center/edituser.vue'),
        meta: {
          title: '编辑信息',
          xauth: true,
          wechat: true,
        }
      },
      {
        path: 'user/password',
        component: () => import('@/views/center/editpassword.vue'),
        meta: {
          title: '重新设置密码',
          xauth: true,
          wechat: true,
        }
      },
      {
        path: 'buyrecordlist',
        component: () => import('@/views/center/buyrecordlst.vue'),
        meta: {
          title: '消费列表',
          xauth: true,
          wechat: true,
        }
      },
      {
        path: 'buyrecord',
        component: () => import('@/views/center/buyrecord.vue'),
        meta: {
          title: '消费商品详情页面',
          xauth: true,
          wechat: true,
        }
      },
      {
        path: 'shoppingbag',
        component: () => import('@/views/center/shoppingbag.vue'),
        meta: {
          title: '购物车',
          xauth: true,
          wechat: true,
        }
      },
    ]
  },
  {
    path: '/admin',
    component: () => import('@/views/admin.vue'),
    meta: {
      title: '后台',
      admin: true,
    },
    children: [
      {
        path: 'home',
        redirect: '/admin/user/list',
      },
      {
        path: 'index',
        redirect: '/admin/user/list',
      },
      {
        path: '',
        redirect: '/admin/user/list',
      },
      {
        path: 'user',
        redirect: "/admin/user/list"
      },
      {
        path: 'user/list',
        component: () => import('@/views/admin/userlst.vue'),
        meta: {
          title: '用户列表',
          admin: true,
        },
      },
      {
        path: 'user/info',
        component: () => import('@/views/admin/user.vue'),
        meta: {
          title: '用户详情',
          admin: true,
        },
      },
      {
        path: 'user/edit',
        redirect: "/admin/user/edit/info"
      },
      {
        path: 'user/edit/info',
        component: () => import('@/views/admin/edituser.vue'),
        meta: {
          title: '编辑用户',
          admin: true,
        },
      },
      {
        path: 'user/edit/password',
        component: () => import('@/views/admin/editpassword.vue'),
        meta: {
          title: '编辑用户密码',
          admin: true,
        },
      },
      {
        path: 'user/edit/phone',
        component: () => import('@/views/admin/editphone.vue'),
        meta: {
          title: '编辑用户手机号',
          admin: true,
        },
      },
      {
        path: 'user/msg',
        component: () => import('@/views/admin/usermsg.vue'),
        meta: {
          title: '查看樱花留言',
          admin: true,
        },
      },
      {
        path: 'user/buy',
        redirect: "/admin/user/buy/list"
      },
      {
        path: 'user/buy/list',
        component: () => import('@/views/admin/buyrecordlst.vue'),
        meta: {
          title: '用户订单列表',
          admin: true,
        },
      },
      {
        path: 'user/buy/info',
        component: () => import('@/views/admin/buyrecord.vue'),
        meta: {
          title: '用户订单详情',
          admin: true,
        },
      },
      {
        path: 'user/buy/wupin',
        redirect: "/admin/user/buy/wupin/sale"
      },
      {
        path: "user/buy/wupin/sale,",
        redirect: "/admin/user/buy/wupin/sale"
      },
      {
        path: 'user/buy/wupin/sale',
        component: () => import('@/views/admin/recordwupin.vue'),
        meta: {
          title: '查看商品售卖详情',
          admin: true,
        },
      },
      {
        path: 'user/buy/wupin/lock',
        component: () => import('@/views/admin/lockwupin.vue'),
        meta: {
          title: '用户订单档案商品详情',
          admin: true,
        },
      },
      {
        path: 'user/bag',
        redirect: "/admin/user/bag/list"
      },
      {
        path: 'user/bag/list',
        component: () => import('@/views/admin/shoppingbag.vue'),
        meta: {
          title: '用户购物车列表',
          admin: true,
        },
      },
      {
        path: 'user/other',
        redirect: "/admin/user/other/add"
      },
      {
        path: 'user/other/add',
        component: () => import('@/views/admin/adduser.vue'),
        meta: {
          title: '添加用户',
          admin: true,
        },
      },
      {
        path: 'user/other/msg',
        component: () => import('@/views/admin/msg.vue'),
        meta: {
          title: '全部用户留言',
          admin: true,
        },
      },
      {
        path: "class",
        redirect: "/admin/class/list"
      },
      {
        path: 'class/list',
        component: () => import('@/views/admin/classlst.vue'),
        meta: {
          title: '商品分类列表',
          admin: true,
        },
      },
      {
        path: 'class/info',
        component: () => import('@/views/admin/class.vue'),
        meta: {
          title: '商品分类列表',
          admin: true,
        },
      },
      {
        path: 'class/edit',
        component: () => import('@/views/admin/editclass.vue'),
        meta: {
          title: '商品分类列表',
          admin: true,
        },
      },
      {
        path: 'class/add',
        component: () => import('@/views/admin/addclass.vue'),
        meta: {
          title: '商品分类列表',
          admin: true,
        },
      },
      {
        path: 'buyrecord',
        redirect: "/admin/buyrecord/list"
      },
      {
        path: 'buyrecord/list',
        component: () => import('@/views/admin/buyrecordlst.vue'),
        meta: {
          title: '购买记录列表',
          admin: true,
        },
      },
      {
        path: 'buyrecord/info',
        component: () => import('@/views/admin/buyrecord.vue'),
        meta: {
          title: '购买记录详情',
          admin: true,
        },
      },
      {
        path: 'xieyi',
        redirect: "/admin/xieyi/show"
      },
      {
        path: 'xieyi/show',
        component: () => import('@/views/admin/xieyi.vue'),
        meta: {
          title: '用户协议',
          admin: true,
        },
      },
      {
        path: 'xieyi/edit',
        component: () => import('@/views/admin/editxieyi.vue'),
        meta: {
          title: '用户协议修改',
          admin: true,
        },
      },
      {
        path: 'config',
        redirect: "/admin/config/"
      },
      {
        path: 'config/list',
        component: () => import('@/views/admin/configlst.vue'),
        meta: {
          title: '配置注册表',
          admin: true,
        },
      },{
        path: 'config/httpserver',
        component: () => import('@/views/admin/configlst.vue'),
        meta: {
          title: '服务prize',
          admin: true,
        },
      },{
        path: 'config/httpserver/stop',
        component: () => import('@/views/admin/httpserver.vue'),
        meta: {
          title: '服务prize',
          admin: true,
          subtitle: "关闭后端Http服务",
        },
      },{
        path: 'config/httpserver/start',
        component: () => import('@/views/admin/httpserver.vue'),
        meta: {
          title: '服务prize',
          admin: true,
          subtitle: "重启后端Http服务",
        },
      },
      {
        path: 'wupin',
        redirect: "/admin/wupin/list"
      },
      {
        path: 'wupin/list',
        component: () => import('@/views/admin/wupinlst.vue'),
        meta: {
          title: '商品列表',
          admin: true,
        },
      },
      {
        path: 'wupin/info',
        component: () => import('@/views/admin/wupin.vue'),
        meta: {
          title: '商品详情',
          admin: true,
        },
      },
      {
        path: 'wupin/edit',
        component: () => import('@/views/admin/editwupin.vue'),
        meta: {
          title: '商品编辑',
          admin: true,
        },
      },
      {
        path: 'wupin/add',
        component: () => import('@/views/admin/addwupin.vue'),
        meta: {
          title: '商品添加',
          admin: true,
        },
      },
      {
        path: "buyrecord",
        redirect: "/admin/buyrecord/list"
      },
      {
        path: 'buyrecord/list',
        component: () => import('@/views/admin/allbuyrecordlst.vue'),
        meta: {
          title: '订单列表',
          admin: true,
        },
      },
      {
        path: 'buyrecord/info',
        component: () => import('@/views/admin/allbuyrecord.vue'),
        meta: {
          title: '订单列表',
          admin: true,
        },
      },
      {
        path: "xieyi",
        redirect: "/admin/xieyi/show"
      },
      {
        path: 'xieyi/show',
        component: () => import('@/views/admin/xieyi.vue'),
        meta: {
          title: '查看用户协议',
          rootAdmin: true,
        },
      },
      {
        path: 'xieyi/edit',
        component: () => import('@/views/admin/editxieyi.vue'),
        meta: {
          title: '编辑用户协议',
          rootAdmin: true,
        },
      },
      {
        path: "config",
        redirect: "/admin/config/list"
      },
      {
        path: 'config/list',
        component: () => import('@/views/admin/configlst.vue'),
        meta: {
          title: '配置项列表',
          rootAdmin: true,
        },
      },
      {
        path: "config/httpserver",
        redirect: "/admin/httpserver/stop"
      },
      {
        path: 'config/httpserver/stop',
        component: () => import('@/views/admin/httpserver.vue'),
        meta: {
          title: '关闭后端Http服务',
          rootAdmin: true,
          subtitle: "关闭后端Http服务",
        },
      },
      {
        path: 'config/httpserver/restart',
        component: () => import('@/views/admin/httpserver.vue'),
        meta: {
          title: '重启后端Http服务',
          rootAdmin: true,
          subtitle: '重启后端Http服务',
        },
      },
    ]
  },
  {
    path: '/test',
    component: () => import('@/views/test.vue'),
    children: [
      {
        path: "",
        redirect: {
          path: "/system/error",
          query: {
            msg: "非法访问测试页面测试",
          }
        }
      },
      {
        path: 'pay',
        component: () => import('@/views/test/testpay.vue'),
        meta: {
          title: '支付测试',
          xauth: true,
          wechat: true,
          test: true,
        }
      },
      {
        path: ":catchAll(.*)",
        redirect: {
          path: "/system/error",
          query: {
            msg: "非法访问测试页面测试",
          }
        }
      },
    ]
  },
  {
    path: '/system',
    component: () => import('@/views/system.vue'),
    children: [
      {
        path: "",
        redirect: "/system/notfound",
      },
      {
        path: 'kefu',
        component: () => import('@/views/system/kefu.vue'),
        meta: {
          title: '我的客服',
        }
      },
      {
        path: 'aboutus',
        component: () => import('@/views/system/aboutus.vue'),
        meta: {
          title: '关于我们',
          wechat: true,
        }
      },
      {
        path: 'error',
        name: "error",
        component: () => import('@/views/system/error.vue'),
        meta: {
          title: '错误',
          wechat: true,
        }
      },
      {
        path: 'notfound',
        component: () => import('@/views/system/notfound.vue'),
        meta: {
          title: '404-页面不存在',
          wechat: true,
          notfound: true,
        }
      },
    ]
  },
  {
    path: "/error",
    redirect: "/system/error",
  },
  {
    path: '/:catchAll(.*)',
    redirect: "/system/notfound",
  },
]

const router = createRouter({
  history: createWebHistory(''),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, nextFn) => {
  const next: NavigationGuardNext = (obj?: any) => {
    placeholderLoading()
    nextFn(obj)
  }

  if (to.meta.xauth && to.meta.xauth === true && !isLogin()) {
    next({
      path: "/shop/login",
      query: {
        [redirect]: encodeURIComponent(to.fullPath)
      }
    })
    return
  }

  if (to.meta.admin && to.meta.admin === true) {
    if (!isLogin()) {
      next({
        path: "/shop/login",
        query: {
          [redirect]: encodeURIComponent(to.fullPath)
        }
      })
      return
    }

    if (!isAdmin()) {
      next({
        path: "/system/error",
        query: {
          msg: "未知页面",
        }
      })
      return
    }
  }

  if (to.meta.rootAdmin && to.meta.rootAdmin === true) {
    if (!isLogin()) {
      next({
        path: "/shop/login",
        query: {
          [redirect]: encodeURIComponent(to.fullPath)
        }
      })
      return
    }

    if (!isRootAdmin()) {
      next({
        path: "/system/error",
        query: {
          msg: "未知页面",
        }
      })
      return
    }
  }

  next()
})

router.afterEach((to) => {
  const configStore = useConfigStore()
  if (to.meta.title && typeof to.meta.title === 'string') {
    if (to.meta.admin && to.meta.admin === true || to.meta.rootAdmin && to.meta.rootAdmin === true) {
      document.title = configStore.config?.name + "管理后台 - " + (to.meta.title || "首页")
    } else {
      document.title = configStore.config?.name + " - " + (to.meta.title || "首页")
    }
  }

  if (to.meta.wechat && to.meta.wechat === true) {
    useWechatStore().open()
  } else {
    useWechatStore().close()
  }

  if (to.meta.admin && to.meta.admin === true) {
    useWechatStore().close()
  }

  usePathStore().pushPath()
  clearPlaceholderLoading()
})

export default router
