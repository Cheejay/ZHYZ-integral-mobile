<template>
  <transition name="scale">
    <div class="confirm-box" v-show="isShow">
      <div class="confirm-box-container">
        <div class="dialog">
          <!-- 退出标题 -->
          <h2 class="dialog-title">{{ confirmTitle }}</h2>
          <!-- 退出文字 -->
          <h3 class="dialog-text">{{ confirmText }}</h3>
          <!-- 按钮 -->
          <div class="btn-group">
            <!-- 取消按钮 -->
            <div class="btn cancel-btn" @click="confirm('cancel')">{{ cancelBtnText }}</div>
            <!-- 确认按钮 -->
            <div class="btn confirm-btn" @click="confirm('confirm')">{{ confirmBtnText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      confirmTitle: {
        type: String,
        default: ''
      },
      confirmText: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确认'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      },
      isShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      confirm(v) {
        this.$emit('confirm', v)
      }
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .confirm-box
    position: fixed
    top: 0
    left: 0
    z-index: 1000
    width: 100%
    height: 100%
    transition: all .3s
    backdrop: blur(10px)
    background-color: rgba(7, 17, 27, .6)
    &.scale-enter, &.scale-leave-active
      opacity: 0
      .dialog
        transform: scale(0.9)
    .confirm-box-container
      height: 100%
      display: flex
      align-items: center
      justify-content: center
      .dialog      
        flex: 0 0 80%
        padding-top: 20px
        width: 80%
        box-sizing: border-box
        border-top: 4px solid $color-text-head
        border-radius: 6px
        transition: all .3s
        text-align: center
        background-color: #FFF
        .dialog-title
          font-size: 22px
          margin-bottom: 15px
        .dialog-text
          padding: 0 15px
          font-size: 16px
          line-height: 1.2em
          margin-bottom: 30px
          word-break: break-all
          color: $color-text-ll
        .btn-group
          display: flex
          border-top: 1px solid $color-border-d
          .btn
            flex: 1
            padding: 14px 0
            box-sizing: border-box
            &:first-child
              border-right: 1px solid $color-border-d
            &:active
              background-color: rgba(0, 0, 0, .1)
            &.confirm-btn
              color: $color-sub-theme
</style>
