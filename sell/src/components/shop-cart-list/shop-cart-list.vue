<template>
    <transition name="fade">
        <cube-popup
          v-show="visible"
          :mask-closable="true"
          :z-index=90
          position="bottom"
          type="shop-cart-list"
          @mask-click="maskClick"
        >
          <transition
            name="move"
          >
            <div v-if="visible">
              <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
              </div>
              <cube-scroll class="list-content" ref="listContent">
                <ul>
                    <li
                    class="food"
                    v-for="food in selectFoods"
                    :key="food.name">
                      <span class="name">{{food.name}}</span>
                      <div class="price">
                        <span>￥{{food.price*food.count}}</span>
                      </div>
                      <div class="cart-control-wrapper">
                        <cart-control @add="onAdd" :food="food"></cart-control>
                      </div>
                    </li>
                </ul>
              </cube-scroll>
            </div>
          </transition>
        </cube-popup>
    </transition>
</template>

<script>
  import CartControl from 'components/cart-control/cart-control'
  import popupMixin from 'common/mixins/popup'

  const EVENT_SHOW = 'show'
  const EVENT_LEAVE = 'leave'
  const EVENT_ADD = 'add'
  export default {
    mixins: [popupMixin],
    name: 'shop-cart-list',
    props: {
        selectFoods: {
            type: Array,
            default() {
                return []
            }
        }
    },
    created() {
      this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
              this.$refs.listContent.refresh()
            })
        })
    },
    methods: {
        onLeave() {
          this.$emit(EVENT_LEAVE)
        },
        maskClick() {
            this.hide()
        },
        onAdd(target) {
          this.$emit(EVENT_ADD, target)
        },
        empty() {
        this.dialogComp = this.$createDialog({
          type: 'confirm',
          // confirm表示类型是一个确认框，如果type为alert就是一个提示框
          content: '清空购物车？',
          $events: {
            confirm: () => {
              // 清空购物车前将所有的购物车东西置为0
              this.selectFoods.forEach((food) => {
                food.count = 0
              })
              this.hide()
            }
          }
        })
        this.dialogComp.show()
      }
    },
    components: {
        CartControl
    }
  }
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable";

.cube-shop-cart-list
  bottom 48px
  &.fade-enter, &.fade-leave-active
    opacity 0
  &.fade-enter-active, &.fade-leave-active
    transition all .3s ease-in-out
  .move-enter, .move-leave-active
    transform translate3d(0, 100%, 0)
  .move-enter-active, .move-leave-active
    transition all .3s ease-in-out
  .list-header
    height 40px
    line-height 40px
    padding 0 18px
    background $color-background-ssss
    .title
      float left
      font-size $fontsize-medium
      color $color-dark-grey
    .empty
      float right
      font-size $fontsize-small
      color $color-blue

  .list-content
    padding 0 18px
    max-height 217px
    overflow hidden
    background $color-white
    .food
      position relative
      padding 12px 0
      box-sizing border-box
      .name
        line-height 24px
        font-size $fontsize-medium
        color $color-dark-grey
      .price
        position absolute
        right 90px
        bottom 12px
        line-height 24px
        font-weight 700
        font-size $fontsize-medium
        color $color-red
      .cart-control-wrapper
        position absolute
        right 0
        bottom 6px
</style>
