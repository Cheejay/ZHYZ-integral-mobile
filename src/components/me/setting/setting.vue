<template>
  <div class="setting">
    <sub-header titleText="设置" :is-show-close-icon="false"></sub-header>
    <div class="setting-container">
      <!-- 基础信息 老师 -->
      <ul class="setting-list-group basic" v-if="personalInfo.user_type === '教师'">
        <!-- 姓名 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-id-card"></i>
            姓名
          </p>
          <p class="text">{{ personalInfo.name }}</p>
        </li>
        <!-- 班级 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-class"></i>
            是否为班主任
          </p>
          <p class="text">{{ isClsTeacher }}</p>
        </li>
        <!-- 学号 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-number"></i>
            工号
          </p>
          <p class="text">{{ personalInfo.number }}</p>
        </li>
      </ul>
      <!-- 基础信息 学生 -->
      <ul class="setting-list-group basic" v-if="personalInfo.user_type === '学生'">
        <!-- 姓名 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-id-card"></i>
            姓名
          </p>
          <p class="text">{{ personalInfo.name }}</p>
        </li>
        <!-- 班级 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-class"></i>
            班级
          </p>
          <p class="text">{{ personalInfo.cls.name }}</p>
        </li>
        <!-- 学号 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-number"></i>
            学号
          </p>
          <p class="text">{{ personalInfo.number }}</p>
        </li>
      </ul>
      <!-- 操作 -->
      <ul class="setting-list-group operate">
        <!-- 修改密码 -->
        <router-link tag="a" to="/setting/changePassword">
          <li class="item">
            <p class="title">
              <i class="zhyz-unlock"></i>
              修改密码
            </p>
            <i class="zhyz-right"></i>
          </li>
        </router-link>
        <!-- 退出登陆 -->
        <li class="item exit" @click="showConfirmBox">
          <p class="title">退出登陆</p>
        </li>
      </ul>
    </div>
    <confirm-box :is-show="isShowConfirmBox"
      confirmTitle="退出当前帐号"
      confirmText="你确定要退出吗？"
      @confirm="logout"></confirm-box>
    <transition name="slide">
     <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import ConfirmBox from 'base/confirm-box/confirm-box'
  import { openVn } from 'common/js/util'
  import { mapMutations, mapGetters } from 'vuex'
  import { saveInfo } from 'common/js/cache'
  import { TOKEN_KEY } from 'common/js/config'

  export default {
    data() {
      return {
        isShowConfirmBox: false
      }
    },
    methods: {
      // 退出账号前确认
      showConfirmBox() {
        this.isShowConfirmBox = true
      },
      // 退出当前账号并清空缓存数据
      logout(v) {
        if(v === 'confirm') {
          openVn('退出成功！')
          this.setToken('')
          saveInfo(TOKEN_KEY, '')
          this.$router.push('/login')
          this.isShowConfirmBox = false
        } else {
          this.isShowConfirmBox = false
        }
      },
      ...mapMutations({
        setToken: 'SET_TOKEN'
      })
    },
    computed: {
      // 文字 是否班主任
      isClsTeacher() {
        return this.personalInfo.is_cls_teacher === 1 ? '是' : '否'
      },
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      SubHeader,
      ConfirmBox
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .setting
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    background-color: $color-background
    .setting-container
      width: 100%
      .setting-list-group
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

