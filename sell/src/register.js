import { createApi } from 'cube-ui'
import Vue from 'vue'
import HeaderDetail from 'components/header-detail/header-detail'
import ShopCartList from 'components/shop-cart-list/shop-cart-list'
import ShopCartSticky from 'components/shop-cart-sticky/shop-cart-sticky'
import Food from 'components/food/food'

createApi(Vue, HeaderDetail)
createApi(Vue, ShopCartList)
createApi(Vue, ShopCartSticky)
createApi(Vue, Food)
