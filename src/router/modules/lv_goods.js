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
    name: `${pre}lv_goods_list`
  },
  component: BasicLayout,
  children: [
    {
      path: 'lv_goods_list',
      name: `${pre}lv_goods_list`,
      meta: {
        title: '商品管理',
        auth: ['admin-store-storeProuduct-index'],
        keepAlive: true
      },
      component: () => import('@/pages/lv_goods/goodsList')
    },
    {
      path: 'add_goods/:id?',
      name: `${pre}goodsAdd`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '商品添加'
      },
      component: () => import('@/pages/lv_goods/goodsAdd')
    },
    {
      path: 'goods_reply/:id?',
      name: `${pre}goodsEvaluate`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '商品评论'
      },
      component: () => import('@/pages/lv_goods/goodsReply')
    },
    {
      path: 'goods_attr',
      name: `${pre}goodsAttr`,
      meta: {
        auth: ['admin-store-storeProuduct-index'],
        title: '商品规格'
      },
      component: () => import('@/pages/lv_goods/goodsAttr')
    }
  ]
}
