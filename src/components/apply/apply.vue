<template>
  <div class="apply">
    <sub-header titleText="申请"></sub-header>
    <div class="apply-container">
      <ul class="apply-list-group operate">
        <!-- 请假 -->
        <router-link tag="a" to="/apply/disease">
          <li class="item">
            <p class="title">
              <i class="zhyz-document"></i>
              请假
            </p>
            <i class="zhyz-edit"></i>
          </li>
        </router-link>
        <!-- 申请留宿 -->
        <router-link tag="a" to="/apply/accommodations">
          <li class="item">
            <p class="title">
              <i class="zhyz-unlock"></i>
              申请留宿
            </p>
            <i class="zhyz-right"></i>
          </li>
        </router-link>
      </ul>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'

  export default {
    components: {
      SubHeader
    }
  }
</script>
  
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .apply
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 50
    background-color: $color-background
    .apply-container
      width: 100%
      .apply-list-group
        margin-bottom: 20px
        &:first-child
          margin-top: 15px
        .item
          display: flex
          align-items: center
          justify-content: space-between
          padding: 14px
          font-size: $font-size-medium-x
          border-bottom: 1px solid $color-border
          background-color: $color-background-d
          // &:first-child
          //   border-top: 1px solid $color-border
          // &:active
          //   background-color: $color-background
          &.exit
            text-align: center              
            .title
              color: $color-sub-theme
          .title
            flex: 1
            color: #000
            i
              font-size: $font-size-large
          .text
            flex: 1
            text-align: right
            color: $color-text-l
</style>
