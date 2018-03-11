<template>
  <div class="me">
    <!-- 设置按钮 -->
    <div class="setting-container">
      <router-link tag="a" to="/setting">
        <span class="setting-icon">
          <i class="setting zhyz-setting"></i>
        </span>
      </router-link>
    </div>
    <!-- 管理员 -->
    <div class="me-container me-teacher" v-if="personalInfo.user_type === '管理员'">
      <!-- 头部 -->
      <div class="head-top">
        <!-- 头像 -->
        <div class="avatar">
          <div class="icon"></div>
        </div>
        <!-- 班级 -->
        <p class="text name">{{ personalInfo.name }}</p>
      </div>
      <!-- 积分栏 -->
      <div class="score-bar">
        <ul class="score-list">
          <!-- 基础积分 -->
          <li class="bar-item">
            <p class="title">角色</p>
            <p class="score-text" v-show="!personalInfo.roles[0]">超级管理员</p>
            <p class="score-text" v-show="personalInfo.roles[0]" v-for="item in personalInfo.roles">{{ item.name }}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 教师 -->
    <div class="me-container me-teacher" v-if="personalInfo.user_type === '教师'">
      <!-- 头部 -->
      <div class="head-top">
        <!-- 头像 -->
        <div class="avatar">
          <div class="icon"></div>
        </div>
        <!-- 班级 -->
        <p class="text name">{{ personalInfo.name }}</p>
      </div>
      <!-- 积分栏 -->
      <div class="score-bar">
        <ul class="score-list">
          <!-- 基础积分 -->
          <li class="bar-item">
            <p class="title">基础积分</p>
            <p class="score-text">{{ personalInfo.teacher_score_basic }}</p>
          </li>
          <li class="bar-item">
            <p class="title">拓展积分</p>
            <p class="score-text">{{ personalInfo.teacher_score_extend }}</p>
          </li>
        </ul>
      </div>
      <!-- 查看xxx -->
      <div class="view-list">
        <ul class="view-list-group basic">
          <!-- 查看十项常规 -->
          <li class="item" @click="viewMesystem" v-if="myTeachCls.length">
            <p class="title">
              <i class="zhyz-id-card"></i>
              查看本班十项常规
            </p>
            <p class="text">
              <i class="zhyz-right"></i>
            </p>
          </li>
          <!-- 审批请假 -->
          <router-link tag="li" to="/processDisease" class="item">
            <p class="title">
              <i class="zhyz-id-edit"></i>
              审批请假
            </p>
            <p class="text">
              <i class="zhyz-right"></i>
            </p>
          </router-link>
        </ul>
        <!-- 班主任带多个班级 选择 -->
        <select-cls :is-show-select-cls="isShowSelectCls" 
          :cls-select-list="myTeachCls"
          @selectCls="selectCls"
          @hideSelectCls="hideSelectCls"></select-cls>
      </div>
    </div>
    <!-- 学生 -->
    <div class="me-container me-student" v-if="personalInfo.user_type === '学生'">
      <!-- 头部 -->
      <div class="head-top" :style="{'background-color': personalInfo.sex === '男' ? '#53a1ff' : '#ff537d'}">
        <!-- 头像 男 -->
        <div class="avatar" v-if="personalInfo.sex === '男'">
          <div class="icon male"></div>
        </div>
        <!-- 头像 女 -->
        <div class="avatar" v-if="personalInfo.sex === '女'">
          <div class="icon female"></div>
        </div>
        <!-- 班级 -->
        <p class="text name">{{ personalInfo.name }}</p>
      </div>
      <!-- 积分栏 -->
      <div class="score-bar">
        <ul class="score-list">
          <!-- 基础积分 -->
          <li class="bar-item">
            <p class="title">总积分</p>
            <p class="score-text">{{ personalInfo.student_score_total }}</p>
          </li>
          <li class="bar-item">
            <p class="title">已换购积分</p>
            <p class="score-text">{{ personalInfo.student_score_exchange }}</p>
          </li>
          <li class="bar-item">
            <p class="title">目前积分</p>
            <p class="score-text">{{ currentScore }}</p>
          </li>
          <li class="bar-item">
            <p class="title">德育分</p>
            <p class="score-text">100</p>
          </li>
        </ul>
      </div>
    </div>
    <m-footer></m-footer>
    <transition name="slide" mode="in-out">
      <router-view :cls-id="myClsId" :cls-name="myClsName"></router-view>
    </transition>
  </div>
</template>

<script>
  import MFooter from 'components/m-footer/m-footer'
  import SelectCls from 'base/select-cls/select-cls'
  import { mapGetters } from 'vuex'
  
  export default {
    data() {
      return {
        myClsId: 0,
        myClsName: '',
        isShowSelectCls: false
      }
    },
    methods: {
      // 当点击了查看十项常规之后
      viewMesystem() {
        // 如果是班主任并且同时带了两个班及两个班以上的情况
        if(this.myTeachCls.length > 1) {
          this.isShowSelectCls = true // 然班主任选择班级
        } else if(this.myTeachCls.length === 1) { // 只带一个班的情况
          this.myClsId = this.myTeachCls[0].id // 把自己班的 id 传给组件
          this.myClsName = this.myTeachCls[0].name // 把自己班的 name 传给组件
          this.$router.push('/mesystem')
        }
      },
      // 当选择了查看的班级之后
      selectCls(cls) {
        this.myClsId = cls.id // 把选择的班级的 id 传给组件
        this.myClsName = cls.name // 把选择的班级的 name 传给组件
        this.$router.push('/mesystem') // 跳转
        this.hideSelectCls() // 隐藏选择组件
      },
      hideSelectCls() { // 隐藏选择班级选项
        this.isShowSelectCls = false
      }
    },
    computed: {
      // 学生目前积分
      currentScore() {
        return this.personalInfo.student_score_total - this.personalInfo.student_score_exchange
      },
      ...mapGetters([
        'myTeachCls',
        'personalInfo'
      ])
    },
    components: {
      MFooter,
      SelectCls
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .me
    line-height: 1
    .setting-container
      position: relative
      height: 100%
      .setting-icon
        extend-click()
        position: absolute
        top: 20px
        right: 20px
        z-index: 99
        .setting
          font-size: $font-size-huge
          color: $color-text-a
    .me-container
      height: 100%
      .head-top
        position: relative
        padding-top: 30px
        height: 210px
        display: flex
        align-items: center
        align-content: center
        justify-content: center
        flex-direction: column
        box-sizing: border-box
        background-color: $color-background-e
        .avatar
          padding-top: 5px
          width: 110px
          height: 110px
          border-radius: 50%
          box-sizing: border-box
          background-color: $color-background-d
          .icon
            width: 100px
            height: 100px
            margin: auto
            border-radius: 50%
            background-size: 100px 100px
            bg-image('avatar_male')
            &.male
              bg-image('avatar_male')
            &.female
              bg-image('avatar_female')
        .text
          margin-top: 8px
          font-size: $font-size-large
          color: $color-text-a
      .score-bar
        width: 100%
        box-shadow: 1px 2px 6px rgba(0, 0, 0, .1)
        background: $color-background-d
        .score-list
          padding: 10px 0
          display: flex
          text-align: center
          align-items: center
          align-content: center
          justify-content: center
          box-sizing: border-box
          .bar-item
            position: relative
            flex: 1
            &:not(:last-child)::after
              content: ''
              position: absolute
              width: 0px
              height: 70%
              transform: translate3d(0, 20%, 0)
              top: 0
              right: 0
              border-right: 1px solid $color-text-c
            .title
              font-size: $font-size-medium
              color: $color-text-l
            .score-text
              margin-top: 5px
              color: $color-text
      .view-list-group
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
  .slide-enter-active, .slide-leave-active {
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
