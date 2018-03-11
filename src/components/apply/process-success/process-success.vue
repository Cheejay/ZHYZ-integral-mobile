<template>
  <div class="done">
    <div class="done-container">
      <!-- 审核成功 -->
      <div class="text">
        <p class="title">
          审核成功！
        </p>
      </div>
      <!-- 完成 -->
      <div class="back-btn">
        <router-link tag="button" 
          to="/apply/processDisease"
          type="button" 
          class="btn">完成</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>
  
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .done
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 50
    background-color: $color-background
    .done-container
      position: relative
      top: 50%
      left: 50%
      transform: translate3d(-50%, -50%, 0)
      padding: 30px
      text-align: center
      .text
        margin-bottom: 50px 
        .title
          font-size: 22px
      .back-btn
        .btn
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
