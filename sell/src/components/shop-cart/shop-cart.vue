<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">
              <bubble :num="totalCount"></bubble>
            </div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 import Bubble from 'components/bubble/bubble'

 const BALL_LEN = 10
 const innerClsHook = 'inner-hook'

 function createBalls() {
    // 在购物车图标处创建小球
    const balls = []
    for (let i = 0; i < BALL_LEN; i++) {
        balls.push({
            // 将小球隐藏起来
            show: false
        })
    }
    return balls
 }
 export default {
    name: 'shop-cart',
    props: {
        // 已选择的商品（通过交互去动态获取）
        selectFoods: {
            type: Array,
            default() {
              return []
          }
        },
        // 配送费
        deliveryPrice: {
            type: Number,
            default: 0
        },
        // 最小起送费
        minPrice: {
            type: Number,
            default: 0
        },
        sticky: {
          type: Boolean,
          default: false
        },
        fold: {
          type: Boolean,
          default: true
        }
    },
    data() {
      return {
        balls: createBalls(),
        listFold: this.fold
      }
    },
    created() {
      this.dropBalls = []
      // listFold标志位去维护展开，默认收起，所以为true
    },
    computed: {
        totalPrice() {
          let total = 0
          this.selectFoods.forEach((food) => {
          // 总价格=食物数量*食物单价
            total += food.price * food.count
          })
          return total
        },
        totalCount() {
            let count = 0
            this.selectFoods.forEach((food) => {
                // 遍历food，再全部相加
                count += food.count
            })
            return count
        },
        payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          const diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (!this.totalCount || this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    methods: {
      toggleList() {
        if (this.listFold) {
          if (!this.totalCount) {
            return
          }
          this.listFold = false
          this._showShopCartList()
          this._showShopCartSticky()
          // 点击购物车触发sticky组件，覆盖原有shop-cart组件
        } else {
          this.listFold = true
          this._hideShopCartList()
        }
      },
      pay(e) {
        if (this.totalPrice < this.minPrice) {
          return
        }
        this.$createDialog({
          title: '支付',
          content: `您共需要支付${this.totalPrice}元`
        }).show()
        e.stopPropagation()
      },
        // 遍历集合,当点击add的时候收集该下落的小球
       drop(el) {
         for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i]
            if (!ball.show) {
                ball.show = true
                ball.el = el
                this.dropBalls.push(ball)
                return
                // 记得return，不然点击一次就会一直循环遍历
            }
         }
       },
       beforeDrop(el) {
        const ball = this.dropBalls[this.dropBalls.length - 1]
        const rect = ball.el.getBoundingClientRect()
        // 获取按钮的位置
        const x = rect.left - 32
        const y = -(window.innerHeight - rect.top - 22)
        // y轴在原有的位置往上移就是负，往下移就是正
        el.style.display = ''
        el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
        // 在Transform前加上webkit可以兼容某些安装的浏览器
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
       },
       dropping(el, done) {
        this._reflow = document.body.offsetHeight
        // 需要触发重排，否则动画展示不出
        el.style.transform = el.style.webkitTransform = 'translate3d(0,0,0)'
        // 初始的位置为按钮的位置
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = 'translate3d(0,0,0)'
        // 目的地址就是开始的地址
        el.addEventListener('transitionend', done)
        // 表示动画结束
       },
       afterDrop(el) {
        const ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
       },
       _showShopCartList() {
        this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
          // 缓存,避免每次都要created
          $props: {
            selectFoods: 'selectFoods'
            // 字符串方式才能够保证它是一个响应式的
          },
          $events: {
            // 当列表展开，listFold为false，再次点击购物车toggleList会把列表隐藏，且把listFold为true,但列表展开，我们不点击购物车，而点击蒙层隐藏的话，listFold就不会设为true,所以我们需要点击蒙层的时候也把listFold设true
            leave: () => {
              this._hideShopCartSticky()
              // 动画结束之后隐藏复刻购物车，（动画结束后，不然动画不协调）
            },
            hide: () => {
              this.listFold = true
            },
            add: (el) => {
              // 接收shop-cart-list的派发事件，并将el交给shop-cart-sticky组件的dropAIP执行，防止小球动画被覆盖
              this.shopCartStickyComp.drop(el)
              // 不能单独调用shopcart的drop方法，因为shopcart的组件被sticky组件覆盖，如果不加shopCartStickyComp则小球动画无法实现
            }
          }
        })
        this.shopCartListComp.show()
       },
       _showShopCartSticky() {
          this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
            $props: {
              selectFoods: 'selectFoods',
              deliveryPrice: 'deliveryPrice',
              minPrice: 'minPrice',
              fold: 'listFold',
              // 此处给fold赋值listFold，属性传值。但这也是创建实例时，其它时候都未修改过fold值。且单例模式只创建一次吧，之后应该就是直接引用实例。不会重复创建实例吧？
              list: this.shopCartListComp
            }
          })
          this.shopCartStickyComp.show()
        },
       _hideShopCartList() {
        const list = this.sticky ? this.$parent.list : this.shopCartListComp
        // 需要一个变量sticky来判断当前购物车是原始的还是复刻的，当购物车为复刻的时候this.$parent.list为shop-cart-sticky组件
        list.hide && list.hide()
        // 有hide方法则执行
       },
       _hideShopCartSticky() {
        this.shopCartStickyComp.hide()
       }
    },
    watch: {
      fold(newVal) {
        this.listFold = newVal
      },
      totalCount(count) {
        if (!this.fold && count === 0) {
          this._hideShopCartList()
        }
      }
    },
    components: {
      Bubble
    }
 }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .shopcart
    height: 100%
    .content
      display: flex
      background: $color-background
      font-size: 0
      color: $color-light-grey
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: $color-background
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: $color-dark-grey
            &.highlight
              background: $color-blue
            .icon-shopping_cart
              line-height: 44px
              font-size: $fontsize-large-xxx
              color: $color-light-grey
              &.highlight
                color: $color-white
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          font-size: $fontsize-large
          &.highlight
            color: $color-white
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: $fontsize-small-s
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-weight: 700
          font-size: $fontsize-small
          &.not-enough
            background: $color-dark-grey
          &.enough
            background: $color-green
            color: $color-white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>
