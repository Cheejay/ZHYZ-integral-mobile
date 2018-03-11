<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">一职积分系统</h1>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 50px
    text-align: center
    color: $color-text
    background-color: $color-background-d
    box-shadow: 1px 2px 5px rgba(0, 0, 0, .1)
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 36px
      height: 36px
      margin-right: 9px
      bg-image('logo')
      background-size: 36px 36px
    .text
      display: inline-block
      vertical-align: top
      line-height: 50px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-text
</style>
