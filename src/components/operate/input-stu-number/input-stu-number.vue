<template>
  <div class="input-student-number">
    <sub-header titleText="操作学生积分" :is-show-close-icon="false"></sub-header>
    <div class="input-container">
      <div class="item">
        <input type="text" v-model="stuKeyword" @keyup.enter="nextStep" maxlength="9" autofocus placeholder="请输入关键字">
        <i class="icon zhyz-error" @click="clearNum" v-show="stuKeyword"></i>
      </div>
      <div class="item">
        <el-button type="primary"
          v-loading.fullscreen.lock="isLoading"
          class="next-btn btn" 
          @click="nextStep">下一步</el-button>
      </div>
      <div class="item">
        <el-button type="primary"
          class="select-stu btn" 
          @click="manualSelectStu">选择学生</el-button>
      </div>
      <div class="often-use-history item" v-show="oftens.length">
        <h1 class="title">
          <span class="text">最常使用</span>
          <!-- <span class="clear">
            <i class="zhyz-clear"></i>
          </span> -->
        </h1>
        <often-list :oftens="oftens" @select="selectOftenClass"></often-list>
      </div>
    </div>
    <transition name="slide">
      <router-view :is-select-stu="true" 
        :search-data-list="studentDataList"></router-view>
    </transition>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import OftenList from 'base/often-list/often-list'
  import { mapMutations } from 'vuex'
  import { LOGIN_ERR } from 'api/config'
  import { openVn, normalizeList, loginFailure } from 'common/js/util'
  import { getStudentInfoByKeyword, getOftenOperateClassList } from 'api/operate'

  export default {
    data() {
      return {
        stuKeyword: null,
        studentDataList: null,
        isLoading: false,
        oftens: []
      }
    },
    created() {
      this._getOftenOperateClassList()
    },
    methods: {
      // 点击下一步按钮
      nextStep() {
        if(!this.stuKeyword) {
          openVn('关键字不能为空！', 'error')
          return
        }
        this._getStudentInfoByKeyword()
      },
      // 手动选择学生
      manualSelectStu() {
        this.$router.push('/inputStudentNumber/selectStudentScore')
      },
      selectOftenClass(item) {
        this.setClassInfo(item.to_cls)
        this.$router.push({
          path: '/inputStudentNumber/classStudent'
        })
      },
      // 清空输入的学号
      clearNum() {
        this.stuKeyword = null
      },
      // 用关键字获取学生信息
      _getStudentInfoByKeyword() {
        this.isLoading = true
        getStudentInfoByKeyword(this.stuKeyword).then((res) => {
          if(!res.code && res.code !== 0) {
            this.studentDataList = normalizeList(res, 'cls.name')
            this.$router.push('/inputStudentNumber/searchResultList')
          } else if(res.code === LOGIN_ERR) {
            loginFailure()
          } else {
            openVn(`${res.msg}`, 'error')
          }
          this.isLoading = false
        })
      },
      // get 常用班级列表
      _getOftenOperateClassList() {
        getOftenOperateClassList().then((res) => {
          this.oftens = res
        })
      },
      ...mapMutations({
        setClassInfo: 'SET_CLASS_INFO'
      })
    },
    components: {
      SubHeader,
      OftenList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .input-student-number
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
        .icon
          position: absolute
          top: 9px
          right: 3px
          padding: 5px
          color: #555
          font-size: $font-size-large-x
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
        &.often-use-history
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-ll
            .text
              flex: 1
            .clear
              extend-click()
              .zhyz-clear
                font-size: $font-size-medium
                color: $color-text-l
  .slide-enter-active, .slide-leave-active {
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>

