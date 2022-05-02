// 商品管理

import BasicLayout from '@/components/main'

const pre = 'lv_goods_'

export default {
  path: '/admin/lv_goods',
  name: 'lv_goods',
  header: 'lv_goods',
  meta: {
    title: '商品',
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
        title: '商品管理',
        auth: ['admin-store-storeProuduct-index'],
        keepAlive: true
      },
      component: () => import('@/pages/lv_goods/productList')
    },
    {
      path: 'add_product/:id?',
      name: `${pre}productAdd`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '商品添加'
      },
      component: () => import('@/pages/lv_goods/productAdd')
    },
    {
      path: 'product_reply/:id?',
      name: `${pre}productEvaluate`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '商品评论'
      },
      component: () => import('@/pages/lv_goods/productReply')
    },
    {
      path: 'product_attr',
      name: `${pre}productAttr`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '商品规格'
      },
      component: () => import('@/pages/lv_goods/productAttr')
    }
  ]
}
