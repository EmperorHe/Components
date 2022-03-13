import Layout from '@/components/layouts/BaseLayout'
import RouteView from '@/components/layouts/RouteView'

// 设置静态菜单项
const baseRouterMap = [
  {
    path: '/',
    component: Layout,
    name: 'Layout',
    redirect: '/dashboard/analysis',
    hidden: false,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/dashboard/analysis',
        component: () => import('@views/dashboard/Analysis'),
        name: 'Analysis',
        meta: {
          title: '首页'
        }
      },
      {
        path: '/demo/common',
        component: RouteView,
        name: 'Demo',
        meta: {
          title: '组件与功能示例'
        },
        children: [
          // {
          //   path: '/demo/common/zv-button',
          //   component: () => import('@/views/docs/zv-button/index'),
          //   name: 'ZvButton',
          //   meta: {
          //     title: 'ZvButton快捷按钮'
          //   }
          // },
          // {
          //   path: '/demo/common/zv-modal',
          //   component: () => import('@/views/docs/zv-modal/index'),
          //   name: 'ZvModal',
          //   meta: {
          //     title: 'ZvModal弹窗组件'
          //   }
          // },
          // {
          //   path: '/demo/common/zv-pdf',
          //   component: () => import('@/views/docs/zv-pdf/index'),
          //   name: 'ZvPdf',
          //   meta: {
          //     title: 'ZvPdf组件'
          //   }
          // },
          {
            path: '/demo/common/scroll-table',
            component: () => import('@/views/docs/scroll-table/index'),
            name: 'ScrollTable',
            meta: {
              title: 'scroll-table组件(不分页渲染大量数据)'
            }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    name: 'Error404',
    component: () => import('@views/error/404.vue'),
    hidden: true,
    meta: {
      title: '404页面'
    }
  }
]

export { baseRouterMap }
