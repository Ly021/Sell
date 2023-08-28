<template>
    <div class="split"></div>
</template>

<script>
  export default {
    name: 'split'
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .split
    width: 100%
    height: 16px
    border-top: 1px solid $color-row-line
    border-bottom: 1px $color-row-line
    background: $color-backgrount-ssss
</style>
