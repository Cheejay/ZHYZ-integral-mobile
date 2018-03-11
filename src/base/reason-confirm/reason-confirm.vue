<template>
  <transition name="scale">
    <div class="select-reason" @click.prevent="clickMask" v-show="isShowReasonConfirm">
      <div class="select-reason-container" @click.stop>
        <ul class="reason-list">
          <h2 class="title-text">{{ titleText === 1 ? '同意原因' : '拒绝原因' }}</h2>
          <li class="reason-item">
            <p class="title">请输入审核意见（最多200字）：</p>
            <textarea v-model="reason" maxlength="200" class="reason-input" placeholder="审核意见"></textarea>
          </li>
          <!-- 确认按钮 -->
          <li class="reason-item">
            <button type="button" class="submit-btn" @click="confirmed">确定</button>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      isShowReasonConfirm: { // 是否显示该组件
        type: Boolean,
        default: false
      },
      titleText: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        reason: ''
      }
    },
    methods: {
      // 当点击了确认之后
      confirmed() {
        this.$emit('confirmed', this.reason)
      },
      // 点击了遮罩层之后
      clickMask() {
        this.$emit('hideReasonConfirm')
      }
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .select-reason
    position: fixed
    top: 0
    left: 0
    z-index: 100
    padding: 30px 20px
    width: calc(100% - 40px)
    height: calc(100% - 60px)
    transition: all .3s
    background-color: rgba(0, 0, 0, .5)
    &.scale-enter, &.scale-leave-active
      opacity: 0
      .select-reason-container
        transform: scale(0.9)
    .select-reason-container
      position: absolute
      top: 50%
      left: 50%
      padding: 30px
      z-index: 100
      width: calc(80% - 60px)
      height: calc(50% - 60px)
      transform: translate3d(-50%, -50%, 0)
      border-radius: 3px
      transition: all .4s cubic-bezier(0,.75,.38,1.36)
      background-color: #FFF
      .reason-list
        position: relative
        top: 50%
        left: 50%
        transform: translate3d(-50%, -50%, 0)
        .title-text
          font-size: 20px
          text-align: center
        .reason-item
          text-align: center
          padding: 25px 0
          .reason-input
            border: none
            outline: none
            resize: none
            display: block
            margin-top: 8px
            padding-bottom: 30px
            width: 100%
            height: 80px
            text-indent: 1em
            font-size: 14px
            font-family: "微软雅黑"
          .submit-btn
            width: 100%
            padding: 8px 0
            color: $color-text-a
            background-color: $color-background-f
            border-radius: 3px
            font-size: 15px
            font-family: "微软雅黑"
            transition: all .3s
            &:active
              background-color: #72cbff
</style>
