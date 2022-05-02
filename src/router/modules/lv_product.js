// 景点管理

import BasicLayout from '@/components/main'

const pre = 'lv_product_'

export default {
  path: '/admin/lv_product',
  name: 'lv_product',
  header: 'lv_product',
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
        title: '景点管理',
        auth: ['admin-store-storeProuduct-index'],
        keepAlive: true
      },
      component: () => import('@/pages/lv_product/productList')
    }
  

  ]
}
