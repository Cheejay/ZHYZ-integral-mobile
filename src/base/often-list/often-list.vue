<template>
  <scroll :data="oftens">
    <div class="often-list" v-if="oftens.length">
      <ul>
        <li class="often-item" 
          @click="selectItem(item)" 
          v-if="index < 5"
          v-for="(item, index) in oftens">
          <span class="text">{{ item.to_cls.name }}</span>
          <span class="icon">
            <i class="zhyz-dot"></i>
          </span>
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'

  export default {
    props: {
      oftens: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .often-list
    .often-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .zhyz-dot
          font-size: $font-size-small
          color: $color-text-ll
</style>
