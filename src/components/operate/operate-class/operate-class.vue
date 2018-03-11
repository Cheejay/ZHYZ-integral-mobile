<template>
  <div class="operate-class">
    <sub-header titleText="操作班级积分"></sub-header>
    <div class="input-container">
      <div class="item">
        <el-button type="primary"
          class="select-stu btn" 
          @click="manualSelectCls">选择班级</el-button>
      </div>
    </div>
    <transition name="slide">
      <router-view :is-select-cls="isSelectCls"></router-view>
    </transition>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import { mapMutations } from 'vuex'

  export default {
    data() {
      return {
        isSelectCls: true
      }
    },
    methods: {
      // 手动选择班级
      manualSelectCls() {
        this.$router.push('/operateClsScore/selectStudentScore')
      },
      ...mapMutations({
        setClassInfo: 'SET_CLASS_INFO'
      })
    },
    components: {
      SubHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .operate-class
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: $color-background
    .input-container
      height: 100%
      padding-top: 40px
      .item
        position: relative
        margin-bottom: 20px
        input
          padding: 15px 0
          width: 100%
          text-align: center
          border-radius: 3px
          transition: all .3s
          &:focus
            box-shadow: 0px 5px 10px rgba(0, 0, 0, .1)
        .btn
          padding: 12px 0
          width: 100%
          color: $color-text-a
          text-align: center
          border-radius: 6px
          font-size: $font-size-large
          box-shadow: 1px 4px 8px rgba(0, 0, 0, .1)
          background-color: $color-background-f
          &:active
            background-color: #2ea1e4
  .slide-enter-active, .slide-leave-active {
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
