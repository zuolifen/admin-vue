// 景点管理

import BasicLayout from '@/components/main'

const pre = 'lv_product_'

export default {
  path: '/admin/lv_product',
  name: 'lv_product',
  header: 'lv_product',
  meta: {
    title: '景点',
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
        title: '景点管理',
        auth: ['admin-store-storeProuduct-index'],
        keepAlive: true
      },
      component: () => import('@/pages/lv_product/productList')
    },
    {
      path: 'add_product/:id?',
      name: `${pre}productAdd`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '景点添加'
      },
      component: () => import('@/pages/lv_product/productAdd')
    },
    {
      path: 'product_reply/:id?',
      name: `${pre}productEvaluate`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '景点评论'
      },
      component: () => import('@/pages/lv_product/productReply')
    },
    {
      path: 'product_attr',
      name: `${pre}productAttr`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '景点规格'
      },
      component: () => import('@/pages/lv_product/productAttr')
    }
  ]
}
