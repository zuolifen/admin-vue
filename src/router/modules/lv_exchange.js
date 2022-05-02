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
    name: `${pre}productList`
  },
  component: BasicLayout,
  children: [
    {
      path: 'product_list',
      name: `${pre}productList`,
      meta: {
        title: '兑换管理',
        auth: ['admin-store-storeProuduct-index'],
        keepAlive: true
      },
      component: () => import('@/pages/lv_exchange/productList')
    },
    {
      path: 'add_product/:id?',
      name: `${pre}productAdd`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '兑换添加'
      },
      component: () => import('@/pages/lv_exchange/productAdd')
    },
    {
      path: 'product_reply/:id?',
      name: `${pre}productEvaluate`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '兑换评论'
      },
      component: () => import('@/pages/lv_exchange/productReply')
    },
    {
      path: 'product_attr',
      name: `${pre}productAttr`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '兑换规格'
      },
      component: () => import('@/pages/lv_exchange/productAttr')
    }
  ]
}
