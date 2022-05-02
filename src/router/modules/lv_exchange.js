// 兑换管理

import BasicLayout from '@/components/main'

const pre = 'lv_exchange_'

export default {
  path: '/admin/lv_exchange',
  name: 'lv_exchange',
  header: 'lv_exchange',
  meta: {
    title: '兑换',
    // 授权标识
    auth: ['admin-store-index']
  },
  redirect: {
    name: `${pre}exchangeList`
  },
  component: BasicLayout,
  children: [
    {
      path: 'lv_exchange_list',
      name: `${pre}exchangeList`,
      meta: {
        title: '兑换管理',
        auth: ['admin-store-storeProuduct-index'],
        keepAlive: true
      },
      component: () => import('@/pages/lv_exchange/exchangeList')
    },
    {
      path: 'add_exchange/:id?',
      name: `${pre}exchangeAdd`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '兑换添加'
      },
      component: () => import('@/pages/lv_exchange/exchangeAdd')
    },
    {
      path: 'exchange_reply/:id?',
      name: `${pre}exchangeEvaluate`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '兑换评论'
      },
      component: () => import('@/pages/lv_exchange/exchangeReply')
    },
    {
      path: 'exchange_attr',
      name: `${pre}exchangeAttr`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '兑换规格'
      },
      component: () => import('@/pages/lv_exchange/exchangeAttr')
    }
  ]
}
