<template>
  <div class="index">
    <m-header></m-header>
    <div class="index-container">
      <!-- 文案 -->
      <div class="copywriter">
        <div class="copywriter-wrapper">
          <!-- 文案图标 -->
          <div class="icon"></div>
          <!-- 文字 -->
          <p class="text">你好</p>
          <p class="text"></p>
        </div>
      </div>
      <!-- 功能按钮 -->
      <div class="operate-btn">
        <ul class="opeate-link opeate-link-first">
          <!-- 输入学号 -->
          <li class="item" v-if="personalInfo.user_type === '管理员' || personalInfo.user_type === '教师'">
            <router-link tag="a" to="/inputStudentNumber">
              <!-- icon 图标 -->
              <div class="icon op1"></div>
              <!-- 文字 -->
              <p class="text">操作学生积分</p>
            </router-link>
          </li>
          <li class="item">
            <router-link tag="a" to="/searchStudentScore">
              <!-- icon 图标 -->
              <div class="icon op2"></div>
              <!-- 文字 -->
              <p class="text">查询学生积分</p>
            </router-link>
          </li>
          <li class="item">
            <router-link tag="a" to="/myOperateDetailList">
              <!-- icon 图标 -->
              <div class="icon op3"></div>
              <!-- 文字 -->
              <p class="text">操作详情</p>
            </router-link>
          </li>
        </ul>
        <ul class="opeate-link opeate-link-second">
          <!-- 操作班级积分 -->
          <li class="item" v-if="personalInfo.user_type === '管理员'">
            <router-link tag="a" to="/operateClsScore">
              <!-- icon 图标 -->
              <div class="icon op1"></div>
              <!-- 文字 -->
              <p class="text">操作班级积分</p>
            </router-link>
          </li>
          <!-- 申请(请病假/留宿) -->
          <li class="item" v-if="personalInfo.user_type === '学生'">
            <router-link tag="a" to="/apply">
              <!-- icon 图标 -->
              <div class="icon op2"></div>
              <!-- 文字 -->
              <p class="text">申请</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <m-footer></m-footer>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import MFooter from 'components/m-footer/m-footer'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      MHeader,
      MFooter
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .index
    width: 100%
    .index-container
      height: 100%
      .copywriter
        height: 180px
        background-color: #feefc4
        .copywriter-wrapper
          padding-top: 40px
          height: 100%
          display: flex
          align-items: center
          align-content: center
          justify-content: center
          flex-direction: column
          box-sizing: border-box
          .icon
            flex: 0 0 60px
            width: 60px
            height: 60px
            bg-image('gift')
            background-size: 60px 60px
          .text
            flex: 1
            margin-top: 15px
            font-size: $font-size-large
      .operate-btn
        width: 100%
        margin: 5px 0 0
        .opeate-link
          display: flex
          align-items: center
          align-content: center
          justify-content: center
          .item
            flex: 1
            padding-top: 40px
            height: 180px
            text-align: center
            background-color: #fec324
            margin-bottom: 5px
            box-sizing: border-box
            transition: all .2s
            &:active
              box-shadow: 0 15px 30px rgba(0, 0, 0, .1)
            &:not(:last-child)
              margin-right: 5px
            .icon
              width: 100%
              height: 55px
              background-size: 55px 55px
              background-position: center
              background-repeat: no-repeat
            .text
              margin-top: 25px
              color: #111
              font-weight: 700
        .opeate-link-first
          .item
            .op1
              bg-image('inputNum')
            .op2
              bg-image('search')
            .op3
              bg-image('detail')
        .opeate-link-second
          .item
            .op1
              bg-image('inputNum')
  .slide-enter-active, .slide-leave-active {
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>