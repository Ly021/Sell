<template>
  <div class="cartcontrol">
    <transition name="move">
        <div class="cart-decrease" v-show="food.count>0" @click.stop="decrease">
          <span class="inner icon-remove_circle_outline"></span>
        </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="add"></div>
  <!-- click后面加一个stop是为了防止冒泡 -->
  </div>
</template>

<script>
  const EVENT_ADD = 'add'

  export default {
    name: 'cart-control',
    props: {
        food: {
          type: Object
        }
    },
    methods: {
        add(event) {
          if (!this.food.count) {
            this.$set(this.food, 'count', 1)
            // 用$set为food增加count这样一个属性
          } else {
            this.food.count++
          }
         this.$emit(EVENT_ADD, event.target)
        //   将点击添加事件派发出去，能够让goods组件接受到
        },
        decrease() {
            if (this.food.count) {
              this.food.count--
            }
        }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .cartcontrol
    display: flex
    align-items: center
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      .inner
        display: inline-block
        line-height: 24px
        font-size: $fontsize-large-xxx
        color: $color-blue
        transition: all 0.5s linear
        // transition过度动画
        transform: rotate(0)
        // transform为设置鼠标滑过翻转效果
      &.move-enter-active, &.move-leave-active
        transition: all 0.5s linear
        // 动画时间0.5s
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(75deg)
        //   旋转75度
    .cart-count
      width: 12px
      line-height: 24px
      text-align: center
      font-size: $fontsize-small-s
      color: $color-grey
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: $fontsize-large-xxx
      color: $color-blue
</style>
