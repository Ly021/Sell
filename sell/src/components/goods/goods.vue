<template>
  <div class="goods">
    <div class="scroll-nav-wrapper">
      <cube-scroll-nav
        :side=true
        :data="goods"
        :options="scrollOptions"
        v-if="goods.length"
      >
       <template slot="bar" slot-scope="props">
        <cube-scroll-nav-bar
        direction="vertical"
        :labels="props.labels"
        :txts="barTxts"
        :current="props.current"
        >
        <template slot-scope="props">
          <div class="text">
            <support-ico
            v-if="props.txt.type>=1"
            :size=3
            :type="props.txt.type"
            ></support-ico>
            <span>{{props.txt.name}}</span>
            <span class="num" v-if="props.txt.count">
              <bubble :num="props.txt.count"></bubble>
            </span>
          </div>
        </template>
      </cube-scroll-nav-bar>
       </template>
        <cube-scroll-nav-panel
          v-for="good in goods"
          :key="good.name"
          :label="good.name"
          :title="good.name"
        >
          <ul>
            <li
              @click="selectFood(food)"
              v-for="food in good.foods"
              :key="food.name"
              class="food-item"
            >
            <!--食物图片-->
              <div class="icon">
                <img width="57" height="57" :src="food.icon" />
              </div>
              <!-- 食物内容 -->
              <div class="content">
                <!-- 食物名称 -->
                <h2 class="name">{{ food.name }}</h2>
                <!-- 食物描述 -->
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <!-- 食物月售及好评 -->
                  <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <!-- 食物价格 -->
                  <span class="now">￥{{ food.price }}</span>
                  <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control @add="onAdd" :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <div class="shop-cart-wrapper">
      <shop-cart
        ref="shopCart"
        :select-foods="selectFoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice">
      </shop-cart>
    </div>
  </div>
</template>
<script>
import { getGoods } from 'api'
import ShopCart from 'components/shop-cart/shop-cart'
import CartControl from 'components/cart-control/cart-control'
import supportIco from 'components/support-ico/support-ico'
import Bubble from 'components/bubble/bubble.vue'

export default {
  name: 'goods',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      goods: [],
      selectedFood: {},
      scrollOptions: {
        click: false,
        // 避免点击事件发生两次
        directionLockThreshold: 0
      }
    }
  },
  computed: {
    seller() {
      return this.data.seller
    },
    selectFoods() {
      const ret = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            ret.push(food)
          }
        })
      })
      return ret
    },
    barTxts() {
      const ret = []
      this.goods.forEach((good) => {
        const { type, name, foods } = good
        let count = 0
        foods.forEach((food) => {
          count += food.count || 0
        })
        ret.push({
          type,
          name,
          count
        })
      })
      return ret
    }
    // 从App.vue传到tab.vue再传到goods.vue中来。
  },
  methods: {
    selectFood(food) {
      this.selectedFood = food
      this._showFood()
      this._showShopCartSticky()
    },
    fetch() {
      if (!this.fetched) {
        // fetched作为标志位，若fetched获取了，则设置为true，此处是和tab的onchange联合，是页面在转换的时候出现数据被刷新的问题，加上if这个判断能够保留已所选的数据
        this.fetched = true
        getGoods().then((goods) => {
        this.goods = goods
        })
      }
    },
    onAdd(target) {
      this.$refs.shopCart.drop(target)
    },
    _showFood() {
      this.foodComp = this.foodComp || this.$createFood({
        $props: {
          food: 'selectedFood'
        },
        $events: {
          // 监听子组件food传给goods的派发事件
          add: (target) => {
            this.shopCartStickyComp.drop(target)
          },
          leave: () => {
            this._hideShopCartSticky()
          }
        }
      })
      this.foodComp.show()
    },
    _showShopCartSticky() {
      this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
        $props: {
          selectFoods: 'selectFoods',
          minPrice: this.seller.minPrice,
          deliveryPrice: this.seller.deliveryPrice,
          fold: true
        }
      })
      this.shopCartStickyComp.show()
    },
    _hideShopCartSticky() {
      this.shopCartStickyComp.hide()
    }
  },
  components: {
    ShopCart,
    CartControl,
    supportIco,
    Bubble
  }
}
</script>
<style lang="stylus" scoped>
   @import "~common/stylus/mixin"
   @import "~common/stylus/variable"

   //不能滚动的原因通常都是不满足滚动条件，即内容的高度没有超过外层容器的高度
   .goods
    position: relative
    height: 100%
    bottom: 0
    .scroll-nav-wrapper
      position: absolute
      width 100%
      top: 0
      left: 0
      bottom: 48px
    >>> .cube-scroll-nav-bar
      width: 80px
      white-space: normal
      overflow: hidden
    >>> .cube-scroll-nav-bar-item
      padding: 0 10px
      display: flex
      align-items: center
      height: 56px
      line-height: 14px
      font-size: $fontsize-small
      background: $color-background-ssss
      .text
        flex: 1
        position: relative
      .num
        position: absolute
        right: -8px
        top: -10px
      .support-ico
        display: inline-block
        vertical-align: top
        margin-right: 4px
    >>> .cube-scroll-nav-bar-item_active
      background: $color-white
      color: $color-dark-grey
    >>> .cube-scroll-nav-panel-title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid $color-col-line
      font-size: $fontsize-small
      color: $color-grey
      background: $color-background-ssss
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      position: relative
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
        img
          height: auto
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: $fontsize-medium
          color: $color-dark-grey
        .desc, .extra
          line-height: 10px
          font-size: $fontsize-small-s
          color: $color-light-grey
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: $fontsize-medium
            color: $color-red
          .old
            text-decoration: line-through
            font-size: $fontsize-small-s
            color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 0
        bottom: 12px
    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 50
      width: 100%
      height: 48px
</style>
