<template>
  <div id="app" @touchmove.prevent>
    <v-header :seller="seller"></v-header>
    <div class="tab-wrapper">
      <tab :tabs="tabs"></tab>
      <!-- initialIndex为默认tab显示内容 -->
    </div>
  </div>
</template>

<script>
import VHeader from 'components/v-header/v-header'
import { getSeller } from 'api'
import Goods from 'components/goods/goods'
import Ratings from 'components/ratings/ratings'
import Seller from 'components/seller/seller'
import Tab from 'components/tab/tab'

export default {
  name: 'app',
  data () {
    return {
      seller: {}
    }
  },
  computed: {
    // 计算属性
    tabs() {
      return [
      {
            label: '商品',
            component: Goods,
            data: {
              // data为对象，需要什么数据则传递什么数据
              seller: this.seller
            }
          },
          {
            label: '评论',
            component: Ratings,
            data: {
              seller: this.seller
            }
          },
          {
            label: '商家',
            component: Seller,
            data: {
              seller: this.seller
            }
          }
      ]
    }
  },
  created() {
    this._getSeller()
  },
  methods: {
    _getSeller() {
        getSeller({
          id: this.seller.id
        }).then((seller) => {
          this.seller = Object.assign({}, this.seller, seller)
        })
      }
  },
  components: {
    Tab,
    VHeader
  }
}
</script>

<style lang="stylus">
    @import "~common/stylus/mixin"
*
  margin 0
  padding 0
  .tab-wrapper
    position: fixed
    top: 136px
    left: 0
    right: 0
    bottom: 0
</style>
