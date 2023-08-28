<template>
    <!-- 模仿shop-cart下面的购物车,因为一开始层级不够,不能够将底部购物车层级提升,所以直接创建一个替换模块 -->
    <div class="shop-cart-sticky" v-show="visible">
        <shop-cart
        ref="shopCart"
        :selectFoods="selectFoods"
        :deliveryPrice="deliveryPrice"
        :minPrice="minPrice"
        :fold="fold"
        :sticky="true"
        >
        </shop-cart>
    </div>
</template>
<script>
 import ShopCart from 'components/shop-cart/shop-cart'
 import popupMixin from 'common/mixins/popup'

 export default {
    mixins: [popupMixin],
    name: 'shop-cart-sticky',
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      fold: {
        type: Boolean,
        default: true
      },
      list: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      drop(el) {
        this.$refs.shopCart.drop(el)
      }
    },
    components: {
      ShopCart
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
